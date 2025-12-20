import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Navigation Bar */}
      <View className="w-full bg-white border-b border-gray-100 shadow-sm">
        <View className="max-w-7xl mx-auto px-8 py-5 flex-row items-center justify-end">
          {/* Navigation Links - Right Aligned */}
          <View className="flex-row items-right" style={{gap: 40}}>
            <TouchableOpacity>
              <Text className="text-gray-700 font-medium text-base hover:text-[#C9A961] transition-colors">Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text className="text-gray-700 font-medium text-base hover:text-[#C9A961] transition-colors">Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Text className="text-gray-700 font-medium text-base hover:text-[#C9A961] transition-colors">About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/favorites')}>
              <Text className="text-gray-700 font-medium text-base hover:text-[#C9A961] transition-colors">Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="w-full flex items-center justify-center">
          {/* Hero Image Section with Overlay */}
          <View className="w-full h-[600px] relative">
          {/* Hotel Image Placeholder */}
          <View className="absolute inset-0 bg-gray-300">
            <Image 
              source={{ uri: 'https://via.placeholder.com/1200x600/2C3E50/FFFFFF?text=House+IX+Hotel' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          
          {/* Dark Overlay */}
          <View className="absolute inset-0 bg-black/40" />
          
          {/* Hotel Name & Info Overlay */}
          <View className="absolute inset-0 items-center justify-center px-6">
            <View className="max-w-4xl w-full mx-auto items-center">
              <Text className="text-5xl md:text-6xl font-bold text-white mb-3 text-center tracking-wide drop-shadow-2xl" style={{fontFamily: 'serif'}}>
                House IX 
              </Text>
              <View className="w-20 h-1 bg-[#C9A961] my-4" />
              <Text className="text-xl md:text-2xl text-gray-100 text-center max-w-2xl leading-relaxed drop-shadow-lg">
                Where luxury meets comfort in the heart of the city
              </Text>
              <Text className="text-lg text-gray-200 mt-3 text-center drop-shadow-lg">
                Kaduna • Nigeria
              </Text>
            </View>
          </View>
        </View>

        {/* About Us Section */}
        <View className="w-full max-w-4xl mx-auto px-6 py-16">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-[#2C3E50] mb-2" style={{fontFamily: 'serif'}}>About Us</Text>
            <View className="w-16 h-1 bg-[#C9A961]" />
          </View>
          <Text className="text-gray-700 text-base leading-relaxed text-center">
            House IX is a premier boutique hotel offering an unparalleled blend of sophistication and warmth. 
            Nestled in the vibrant heart of Kaduna, we provide our guests with exceptional service, 
            thoughtfully designed accommodations, and world-class amenities. Whether you're here for business 
            or leisure, House IX delivers an unforgettable experience that feels like home.
          </Text>
        </View>

        {/* Video Section */}
        <View className="w-full max-w-5xl mx-auto px-6 py-16">
          <View className="bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
            <View className="aspect-video bg-gray-800 items-center justify-center relative">
              {/* Video Placeholder */}
              <View className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
              <View className="items-center justify-center z-10">
                <View className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4 border-2 border-white/30">
                  <Ionicons name="play" size={48} color="white" />
                </View>
                <Text className="text-white text-lg font-semibold">Experience House IX</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hotel Highlights */}
        <View className="w-full max-w-6xl mx-auto px-6 py-20 bg-gradient-to-b from-white to-gray-50">
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-[#2C3E50] mb-2" style={{fontFamily: 'serif'}}>Why Choose House IX</Text>
            <View className="w-16 h-1 bg-[#C9A961]" />
          </View>
          
          <View className="flex-row flex-wrap justify-center" style={{gap: 24}}>
            {/* Highlight 1 */}
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] items-center hover:shadow-2xl transition-shadow">
              <View className="bg-gradient-to-br from-[#2C3E50] to-[#34495e] rounded-full p-5 mb-4 shadow-lg">
                <Ionicons name="location" size={32} color="#C9A961" />
              </View>
              <Text className="text-[#2C3E50] font-bold text-lg mb-2" style={{fontFamily: 'serif'}}>Prime Location</Text>
              <Text className="text-gray-600 text-sm text-center leading-relaxed">In the heart of Kaduna's business district</Text>
            </View>

            {/* Highlight 2 */}
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] items-center hover:shadow-2xl transition-shadow">
              <View className="bg-gradient-to-br from-[#2C3E50] to-[#34495e] rounded-full p-5 mb-4 shadow-lg">
                <Ionicons name="wifi" size={32} color="#C9A961" />
              </View>
              <Text className="text-[#2C3E50] font-bold text-lg mb-2" style={{fontFamily: 'serif'}}>Modern Amenities</Text>
              <Text className="text-gray-600 text-sm text-center leading-relaxed">High-speed WiFi, smart rooms & more</Text>
            </View>

            {/* Highlight 3 */}
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] items-center hover:shadow-2xl transition-shadow">
              <View className="bg-gradient-to-br from-[#2C3E50] to-[#34495e] rounded-full p-5 mb-4 shadow-lg">
                <Ionicons name="restaurant" size={32} color="#C9A961" />
              </View>
              <Text className="text-[#2C3E50] font-bold text-lg mb-2" style={{fontFamily: 'serif'}}>Fine Dining</Text>
              <Text className="text-gray-600 text-sm text-center leading-relaxed">Exquisite cuisine & cocktail lounge</Text>
            </View>

            {/* Highlight 4 */}
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] items-center hover:shadow-2xl transition-shadow">
              <View className="bg-gradient-to-br from-[#2C3E50] to-[#34495e] rounded-full p-5 mb-4 shadow-lg">
                <Ionicons name="people" size={32} color="#C9A961" />
              </View>
              <Text className="text-[#2C3E50] font-bold text-lg mb-2" style={{fontFamily: 'serif'}}>Guest Services</Text>
              <Text className="text-gray-600 text-sm text-center leading-relaxed">Personalized attention & concierge</Text>
            </View>
          </View>
        </View>

        {/* Main CTA */}
        <View className="w-full max-w-5xl mx-auto px-6 pb-20">
          <View className="items-center">
            <TouchableOpacity
              className="bg-gradient-to-r from-[#C9A961] to-[#D4AF37] py-6 px-12 rounded-full shadow-2xl active:opacity-90"
              onPress={() => router.push('/(tabs)/explore')}
              style={{
                shadowColor: '#C9A961',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center justify-center" style={{gap: 12}}>
                <Text className="text-white text-xl font-bold tracking-wider" style={{fontFamily: 'serif'}}>
                  Explore Our Rooms
                </Text>
                <Ionicons name="arrow-forward" size={26} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-gray-500 text-center mt-6 text-base leading-relaxed max-w-md">
              Discover the perfect accommodation for your stay
            </Text>
          </View>
        </View>

        {/* Guest Reviews */}
        <View className="w-full max-w-6xl mx-auto px-6 py-20 bg-gray-50">
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-[#2C3E50] mb-2" style={{fontFamily: 'serif'}}>What Our Guests Say</Text>
            <View className="w-16 h-1 bg-[#C9A961]" />
          </View>

          <View className="flex-row flex-wrap justify-center" style={{gap: 24}}>
            {/* Review 1 */}
            <View className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <View className="flex-row items-center mb-4">
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
              </View>
              <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                "Exceptional service and beautiful rooms. The staff went above and beyond to make our stay memorable. Highly recommend!"
              </Text>
              <Text className="text-[#2C3E50] font-semibold text-sm">Sarah M.</Text>
              <Text className="text-gray-500 text-xs">Google Review</Text>
            </View>

            {/* Review 2 */}
            <View className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <View className="flex-row items-center mb-4">
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
              </View>
              <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                "Perfect location, amazing dining experience. The rooms are spotless and the amenities are top-notch."
              </Text>
              <Text className="text-[#2C3E50] font-semibold text-sm">David O.</Text>
              <Text className="text-gray-500 text-xs">Google Review</Text>
            </View>

            {/* Review 3 */}
            <View className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <View className="flex-row items-center mb-4">
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
                <Ionicons name="star" size={20} color="#C9A961" />
              </View>
              <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                "A truly luxurious experience. From check-in to check-out, everything was seamless. Will definitely return!"
              </Text>
              <Text className="text-[#2C3E50] font-semibold text-sm">Amina K.</Text>
              <Text className="text-gray-500 text-xs">Google Review</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="w-full py-8 bg-[#2C3E50] border-t border-gray-700">
          <Text className="text-center text-gray-400 text-sm">
            © 2025 House IX Hotel. All rights reserved.
          </Text>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

