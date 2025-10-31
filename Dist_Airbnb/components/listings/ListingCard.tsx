import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListingPreview } from '@/types/listing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width with padding

interface ListingCardProps {
  listing: ListingPreview;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  tall?: boolean;
}

export default function ListingCard({
  listing,
  onPress,
  onFavorite,
  isFavorite = false,
  tall = false
}: ListingCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl shadow-lg mb-4 mx-4 overflow-hidden"
      style={{ width: CARD_WIDTH }}
    >
      {/* Image Container */}
      <View className="relative">
        <Image 
          source={{ uri: listing.imageUrl || 'https://via.placeholder.com/400x250' }} 
          className={tall ? "w-full h-96" : "w-full h-56"}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

        {/* Favorite Button */}
        {onFavorite && (
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md"
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#EF4444" : "#374151"} 
            />
          </TouchableOpacity>
        )}

        {/* Price Badge */}
        <View className="absolute bottom-3 left-3 bg-white/95 rounded-full px-3 py-1.5 shadow-md">
          <Text className="text-sm font-bold text-gray-800">
            ${listing.price}
            <Text className="text-xs font-normal text-gray-600">/night</Text>
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View className="p-4">
        {/* Title */}
        <Text 
          className="text-lg font-bold text-gray-900 mb-1" 
          numberOfLines={2}
        >
          {listing.title}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text 
            className="text-sm text-gray-600 ml-1 flex-1" 
            numberOfLines={1}
          >
            {listing.location}
          </Text>
        </View>

        {/* Bottom Row - View Details */}
        <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
          <Text className="text-blue-600 font-semibold text-sm">
            View Details
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#2563EB" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
