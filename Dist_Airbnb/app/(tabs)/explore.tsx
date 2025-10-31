import React, { useState, useEffect } from 'react';
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
  const [totalAvailable, setTotalAvailable] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings/count');
        const data = await response.json();
        setTotalAvailable(data.count || listings.length);
      } catch (err) {
        setTotalAvailable(listings.length);
      }
    };
    fetchTotal();
  }, [listings]);

  // Filter listings based on search
  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [offset, setOffset] = useState(0);
  const PAGE_SIZE = 20;

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
        {/* Total Available Count (white text only) */}
        {!isLoading && (
          <View className="mt-2 mb-2">
            <Text className="text-white text-base font-semibold">
              {totalAvailable.toLocaleString()} properties available
            </Text>
          </View>
        )}
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
      <FlatList
        data={filteredListings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => router.push(`/listing/${item.id}`)}
            onFavorite={() => toggleFavorite(item.id)}
            isFavorite={isFavorite(item.id)}
          />
        )}
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
