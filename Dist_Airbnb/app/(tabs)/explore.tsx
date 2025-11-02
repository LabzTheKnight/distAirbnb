import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListings } from '@/context/ListingContent';
import ListingCard from '@/components/listings/ListingCard';

const ExploreScreen = () => {
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
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 20;

  // Force two columns in the list
  const numColumns = 2;

  const handleRefresh = () => {
    setOffset(0);
    refreshListings(PAGE_SIZE, 0);
  };

  const handleLoadMore = () => {
    if (!isLoading && listings.length >= PAGE_SIZE) {
      const newOffset = offset + PAGE_SIZE;
      setOffset(newOffset);
      refreshListings(PAGE_SIZE, newOffset);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <LinearGradient
        colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
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
        {/* Search Bar (reduced height) */}
        <View className="bg-white/95 rounded-2xl flex-row items-center px-4 py-2 shadow-lg">
          <Ionicons name="search" size={18} color="#9CA3AF" />
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
              size={18} 
              color="#9CA3AF" 
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </LinearGradient>

      {/* NOTE: 'Listings available' will be rendered as the FlatList header so it appears just before the first item */}
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
      <FlatList
        ListHeaderComponent={() => (
          <View className="w-full px-6 py-2">
            <Text className="text-gray-600 text-base">Listings available: 5,553</Text>
          </View>
        )}
        data={filteredListings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ flex: 1, paddingHorizontal: 8, marginBottom: 16 }}>
            <ListingCard
              listing={item}
              onPress={() => router.push(`/listing/${item.id}`)}
              onFavorite={() => toggleFavorite(item.id)}
              isFavorite={isFavorite(item.id)}
            />
          </View>
        )}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 24 }}
        ListEmptyComponent={isLoading ? <ActivityIndicator size="large" color="#888" /> : null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExploreScreen;
