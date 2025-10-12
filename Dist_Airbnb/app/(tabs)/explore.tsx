import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListings } from '@/context/ListingContent';
import ListingCard from '@/components/listings/ListingCard';
import { ListingCardSkeletonList } from '@/components/listings/ListingCardSkeleton';

export default function ExploreScreen() {
  const router = useRouter();
  const { 
    listings, 
    isLoading, 
    error, 
    refreshListings,
    toggleFavorite,
    isFavorite 
  } = useListings();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter listings based on search
  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    try {
      await refreshListings(20, 0);
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh listings');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-14 pb-6 px-6 rounded-b-3xl"
      >
        <Text className="text-3xl font-bold text-white mb-2">
          Explore Stays
        </Text>
        <Text className="text-blue-100 text-base mb-4">
          Discover amazing places to stay
        </Text>

        {/* Search Bar */}
        <View className="bg-white/95 rounded-2xl flex-row items-center px-4 py-3 shadow-lg">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search by name or location..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#9CA3AF" 
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </LinearGradient>

      {/* Error Message */}
      {error && (
        <View className="mx-4 mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <View className="flex-row items-center">
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text className="text-red-700 font-semibold ml-2 flex-1">
              {error}
            </Text>
          </View>
        </View>
      )}

      {/* Listings */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
      >
        {/* Results Count */}
        {!isLoading && (
          <View className="mx-4 mb-3">
            <Text className="text-gray-600 font-medium">
              {filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found
            </Text>
          </View>
        )}

        {/* Loading Skeleton */}
        {isLoading && listings.length === 0 && (
          <ListingCardSkeletonList count={5} />
        )}

        {/* Listings List */}
        {!isLoading && filteredListings.length > 0 && (
          filteredListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => router.push(`/listing/${listing.id}`)}
              onFavorite={() => toggleFavorite(listing.id)}
              isFavorite={isFavorite(listing.id)}
            />
          ))
        )}

        {/* No Results */}
        {!isLoading && filteredListings.length === 0 && listings.length > 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No listings found</Text>
            <Text className="text-gray-400 text-sm mt-2">Try a different search term</Text>
          </View>
        )}

        {/* Empty State (No data from backend) */}
        {!isLoading && listings.length === 0 && !error && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="home-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No listings available</Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-8">
              Pull down to refresh or check if the backend is running
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
