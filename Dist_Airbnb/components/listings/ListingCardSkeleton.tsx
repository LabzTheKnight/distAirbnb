import React from 'react';
import { View } from 'react-native';

const CARD_MAX_WIDTH = 900;

export default function ListingCardSkeleton() {
  return (
    <View 
      className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden animate-pulse"
      style={{ width: '100%', maxWidth: CARD_MAX_WIDTH, alignSelf: 'center' }}
    >
      {/* Image Skeleton */}
      <View className="w-full h-56 bg-gray-200" />

      {/* Content Skeleton */}
      <View className="p-4">
        {/* Title */}
        <View className="h-5 bg-gray-200 rounded-md mb-2 w-3/4" />
        
        {/* Location */}
        <View className="h-4 bg-gray-200 rounded-md mb-3 w-1/2" />
        
        {/* Bottom */}
        <View className="h-4 bg-gray-200 rounded-md w-1/3" />
      </View>
    </View>
  );
}

// Multiple skeletons
export function ListingCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </>
  );
}
