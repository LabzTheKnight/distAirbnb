import { Platform, Button, Alert, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { HelloWave } from "@/components/hello-wave";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useListings } from "@/context/ListingContent";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ListingCard from "@/components/listings/ListingCard";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, signIn, signOut } = useAuth();
  const { listings, toggleFavorite, isFavorite } = useListings();

  // Get first 5 listings for featured section
  const featuredListings = listings.slice(0, 5);

  const handleTestLogin = async () => {
    try {
      // Replace with real credentials
      await signIn("testuser", "testpass123");
      Alert.alert("Success", "Login successful!");
    } catch (error) {
      Alert.alert("Error", "Login failed. Check your backend is running.");
    }
  };

  const handleTestLogout = async () => {
    try {
      await signOut();
      Alert.alert("Success", "Logout successful!");
    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <Text className="text-xl font-semibold text-gray-700">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-6 px-6 rounded-b-3xl"
      >
        {/* Welcome Section */}
        <View className="mb-4">
          <View className="flex-row items-center gap-3">
            <Text className="text-4xl font-bold text-white">Welcome!</Text>
            <HelloWave />
          </View>
          <Text className="text-blue-100 mt-2 text-base">
            Your distributed Airbnb experience starts here and now ❤️❤️❤️
          </Text>
        </View>
      </LinearGradient>

      {/* Auth Test Card */}
      <View className="mx-4 mt-6 mb-4 bg-white rounded-2xl shadow-lg overflow-hidden">
        <View className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <Text className="text-xl font-bold text-white">🔐 Authentication Status</Text>
        </View>
        
        <View className="p-6">
          {isLoggedIn ? (
            <View className="space-y-3">
              <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                <Text className="text-green-800 font-semibold text-base mb-2">
                  ✅ Logged in successfully
                </Text>
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons name="person" size={16} color="#16a34a" />
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Username:</Text> {user?.username}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="mail" size={16} color="#16a34a" />
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Email:</Text> {user?.email}
                  </Text>
                </View>
              </View>
              <View className="pt-2">
                <Button title="Sign Out" onPress={handleTestLogout} color="#ef4444" />
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              <View className="bg-red-50 rounded-xl p-4 border border-red-200">
                <Text className="text-red-800 font-semibold text-base">
                  ❌ Not authenticated
                </Text>
                <Text className="text-red-600 text-sm mt-1">
                  Please sign in to continue
                </Text>
              </View>
              <View className="pt-2">
                <Button title="Test Login" onPress={handleTestLogin} color="#3b82f6" />
              </View>
              <View className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <Text className="text-yellow-800 text-xs">
                  ⚠️ Note: Make sure your backend is running on localhost:8001
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Quick Start Guide */}
      <View className="mx-4 mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4 px-2">
          🚀 Quick Start Guide
        </Text>

        {/* Step 1 */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-md border-l-4 border-blue-500">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="bg-blue-500 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-white font-bold">1</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Try it</Text>
          </View>
          <Text className="text-gray-600 leading-6 ml-11">
            Edit <Text className="font-bold text-blue-600">app/(tabs)/index.tsx</Text> to see
            changes. Press{" "}
            <Text className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
              {Platform.select({ ios: "cmd + d", android: "cmd + m", web: "F12" })}
            </Text>{" "}
            to open developer tools.
          </Text>
        </View>

        {/* Step 2 */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-md border-l-4 border-green-500">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="bg-green-500 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-white font-bold">2</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Explore</Text>
          </View>
          <View className="ml-11">
            <Link href="/modal" asChild>
              <Text className="text-blue-500 font-semibold text-base underline mb-2">
                📱 Open Modal Example
              </Text>
            </Link>
            <Text className="text-gray-600">
              Tap the Explore tab to learn more about what's included in this starter app.
            </Text>
          </View>
        </View>

        {/* Step 3 */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-md border-l-4 border-purple-500">
          <View className="flex-row items-center gap-3 mb-3">
            <View className="bg-purple-500 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-white font-bold">3</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800">Get a fresh start</Text>
          </View>
          <Text className="text-gray-600 leading-6 ml-11">
            When you're ready, run{" "}
            <Text className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
              npm run reset-project
            </Text>{" "}
            to get a fresh <Text className="font-semibold">app</Text> directory.
          </Text>
        </View>
      </View>

      {/* Featured Listings Section */}
      {featuredListings.length > 0 && (
        <View className="mx-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900">
              Featured Stays
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text className="text-blue-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          
          {featuredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => router.push(`/listing/${listing.id}`)}
              onFavorite={() => toggleFavorite(listing.id)}
              isFavorite={isFavorite(listing.id)}
            />
          ))}
        </View>
      )}

      {/* Footer */}
      <View className="mx-4 mb-8 p-6 bg-gray-100 rounded-2xl">
        <Text className="text-center text-gray-600 text-sm">
          Built with ❤️ using React Native + Expo
        </Text>
      </View>
    </ScrollView>
  );
}

