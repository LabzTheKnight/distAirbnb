import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListings } from '@/context/ListingContent';
import ListingCard from '@/components/listings/ListingCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const { 
    listings, 
    isLoading, 
    refreshListings,
    toggleFavorite,
    isFavorite 
  } = useListings();

  // Filter to only show favorited listings
  const favoriteListings = listings.filter(listing => isFavorite(listing.id));

  const handleRefresh = async () => {
    await refreshListings(20, 0);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#EF4444', '#EC4899', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-6 px-6 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">
              Favorites
            </Text>
            <Text className="text-red-100 text-base">
              Your saved places
            </Text>
          </View>
          <View className="bg-white/20 rounded-full p-3">
            <Ionicons name="heart" size={32} color="white" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#EF4444"
          />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
      >
        {/* Count */}
        {favoriteListings.length > 0 && (
          <View className="mx-4 mb-3">
            <Text className="text-gray-600 font-medium">
              {favoriteListings.length} {favoriteListings.length === 1 ? 'favorite' : 'favorites'}
            </Text>
          </View>
        )}

        {/* Favorites List */}
        {favoriteListings.length > 0 ? (
          favoriteListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => router.push(`/listing/${listing.id}`)}
              onFavorite={() => toggleFavorite(listing.id)}
              isFavorite={true}
            />
          ))
        ) : (
          // Empty State
          <View className="flex-1 justify-center items-center py-32 px-8">
            <View className="bg-red-100 rounded-full p-6 mb-4">
              <Ionicons name="heart-outline" size={64} color="#EF4444" />
            </View>
            <Text className="text-gray-900 text-2xl font-bold mb-2 text-center">
              No Favorites Yet
            </Text>
            <Text className="text-gray-500 text-base mb-6 text-center">
              Start exploring and tap the heart icon on listings you love
            </Text>
            <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-6 py-3">
              <Text 
                className="text-white font-semibold text-base"
                onPress={() => router.push('/(tabs)/explore')}
              >
                Explore Listings
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}