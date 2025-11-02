import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HelloWave } from "@/components/hello-wave";
import { useRouter } from "expo-router";
import { useListings } from "@/context/ListingContent";
import { LinearGradient } from "expo-linear-gradient";
import ListingCard from "@/components/listings/ListingCard";

export default function HomeScreen() {
  const router = useRouter();
  const { listings } = useListings();
  // Show 10 featured stays on the index page
  const featuredListings = listings.slice(0, 10);

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-blue-100 via-white to-pink-50 min-h-screen">
      <View className="w-full flex items-center justify-center">
        {/* Hero Section */}
        <LinearGradient
          colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full flex items-center justify-center py-10 px-4 rounded-b-3xl"
        >
          <View className="max-w-3xl w-full flex items-center justify-center mx-auto">
            <Text className="text-2xl md:text-3xl font-extrabold text-white mb-2 text-center drop-shadow-lg tracking-tight" style={{lineHeight: 36}}>
              Distributed Airbnb 
            </Text>
            <Text className="text-base md:text-lg text-blue-100 mt-3 text-center max-w-lg">
              Discover unique stays and experiences from a distributed, scalable platform. Fast, secure, and beautiful—built for the modern web.
            </Text>
            <TouchableOpacity
              className="mt-6 bg-white rounded-full px-6 py-2 shadow-xl hover:bg-blue-50"
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text className="text-base font-bold text-blue-600 tracking-wide">Browse Listings</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Featured Listings Section */}
        {featuredListings.length > 0 && (
          <View className="max-w-6xl w-full mx-auto px-4 mb-10">
            <View className="flex-row justify-between items-center mb-6 mt-8">
              <Text className="text-xl font-bold text-gray-900">Featured Stays</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text className="text-blue-600 font-semibold text-base">View All</Text>
              </TouchableOpacity>
            </View>
            {/* Responsive two-column grid: one column on small screens, two on md+ */}
            <View className="flex flex-row flex-wrap -mx-2">
              {featuredListings.map(listing => (
                <View key={listing.id} className="w-full md:w-1/2 px-2 mb-4">
                  <ListingCard
                    listing={listing}
                    onPress={() => router.push(`/listing/${listing.id}`)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View className="w-full py-8 bg-gray-100 mt-8">
          <Text className="text-center text-gray-500 text-base">
            Built with ❤️ using React Native + Expo Web
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

