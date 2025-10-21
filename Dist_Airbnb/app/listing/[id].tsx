"use client";
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useListings } from '@/context/ListingContent';
import { useAuth } from '@/context/AuthContext';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    selectedListing, 
    selectListing, 
    isLoading,
    toggleFavorite,
    isFavorite,
    addReview 
  } = useListings();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      selectListing(id);
    }
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewComment.trim()) {
      Alert.alert('Error', 'Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await addReview(id, reviewComment);
      Alert.alert('Success', 'Review added successfully!');
      setReviewComment('');
      setShowReviewForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading listing...</Text>
      </View>
    );
  }

  if (!selectedListing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-gray-900 text-xl font-bold mt-4">Listing Not Found</Text>
        <Text className="text-gray-600 mt-2">This listing may have been removed</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-6 bg-blue-500 rounded-lg px-6 py-3"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasReviews = Array.isArray(selectedListing.reviews) && selectedListing.reviews.length > 0;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image 
            source={{ uri: selectedListing.imageUrl || 'https://via.placeholder.com/400x300' }} 
            className="w-full h-80"
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-white/90 rounded-full p-2 shadow-lg"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity 
            onPress={() => toggleFavorite(id)}
            className="absolute top-12 right-4 bg-white/90 rounded-full p-2 shadow-lg"
          >
            <Ionicons 
              name={isFavorite(id) ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite(id) ? "#EF4444" : "#000"} 
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="p-6">
          {/* Title & Price */}
          <View className="mb-4">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {selectedListing.title}
            </Text>
            
            {/* Location */}
            <View className="flex-row items-center mb-3">
              <Ionicons name="location" size={18} color="#6B7280" />
              <Text className="text-gray-600 ml-1 text-base">
                {selectedListing.location}
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-blue-600">
                ${selectedListing.price}
              </Text>
              <Text className="text-gray-600 text-lg ml-2">/night</Text>
            </View>
          </View>

          {/* Rating */}
          {selectedListing.rating > 0 && (
            <View className="flex-row items-center bg-gray-100 rounded-xl p-4 mb-6">
              <Ionicons name="star" size={24} color="#F59E0B" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                {selectedListing.rating.toFixed(1)}
              </Text>
              <Text className="text-gray-600 ml-2">Rating</Text>
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              About this place
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              {selectedListing.description || 'No description available'}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 my-6" />

          {/* Reviews Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Reviews
              </Text>
              {user && (
                <TouchableOpacity 
                  onPress={() => setShowReviewForm(!showReviewForm)}
                  className="bg-blue-500 rounded-lg px-4 py-2"
                >
                  <Text className="text-white font-semibold text-sm">
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Add Review Form */}
            {showReviewForm && (
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Share your experience
                </Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-3 mb-3 min-h-24"
                  placeholder="Write your review here..."
                  placeholderTextColor="#9CA3AF"
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={handleAddReview}
                  disabled={submittingReview}
                  className={`rounded-lg py-3 items-center ${submittingReview ? 'bg-blue-300' : 'bg-blue-500'}`}
                >
                  {submittingReview ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text className="text-white font-bold">Submit Review</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Reviews List */}
            {hasReviews ? (
              (selectedListing.reviews as any[]).map((review: any, index: number) => (
                <View 
                  key={index} 
                  className="bg-gray-50 rounded-xl p-4 mb-3"
                >
                  <View className="flex-row items-center mb-2">
                    <View className="bg-blue-500 rounded-full w-10 h-10 items-center justify-center mr-3">
                      <Text className="text-white font-bold text-lg">
                        {review.reviewer_name?.charAt(0).toUpperCase() || '?'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">
                        {review.reviewer_name || 'Anonymous'}
                      </Text>
                      {review.date && (
                        <Text className="text-xs text-gray-500">
                  {/* Render deterministic ISO date to avoid SSR/client locale mismatches */}
                  {new Date(review.date).toISOString().split('T')[0]}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text className="text-gray-700 leading-5">
                    {review.comments}
                  </Text>
                </View>
              ))
            ) : (
              <View className="bg-gray-50 rounded-xl p-8 items-center">
                <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-3 text-center">
                  No reviews yet. Be the first to review!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View className="px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity className="rounded-xl overflow-hidden">
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center"
          >
            <Text className="text-white font-bold text-lg">
              Book Now - ${selectedListing.price}/night
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}