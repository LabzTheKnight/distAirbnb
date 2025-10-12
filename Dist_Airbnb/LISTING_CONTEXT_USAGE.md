# ListingContext - Quick Usage Guide

## 🎯 **What It Does**

ListingContext provides:
- ✅ **Global listing data** - Fetch once, use everywhere
- ✅ **Caching** - No duplicate API calls
- ✅ **Favorites** - Toggle favorites on any screen
- ✅ **Loading states** - Consistent across app
- ✅ **Error handling** - Global error messages

---

## 🚀 **Setup (Do Once)**

### 1. Wrap your app with the provider:

```typescript
// app/_layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import { ListingProvider } from '@/context/ListingContent';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ListingProvider>  {/* ← Add this */}
        <Stack>
          {/* Your routes */}
        </Stack>
      </ListingProvider>
    </AuthProvider>
  );
}
```

---

## 📖 **Usage in Screens**

### **Example 1: Explore Screen (List All Listings)**

```typescript
// app/(tabs)/explore.tsx
import { useListings } from '@/context/ListingContent';
import { View, FlatList, RefreshControl } from 'react-native';

export default function ExploreScreen() {
  const { 
    listings,        // Array of ListingPreview
    isLoading,       // Boolean
    error,           // String | null
    refreshListings, // Function to reload
    toggleFavorite,  // Function to favorite/unfavorite
    isFavorite       // Function to check if favorited
  } = useListings();

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onPress={() => router.push(`/listing/${item.id}`)}
          onFavorite={() => toggleFavorite(item.id)}
          isFavorite={isFavorite(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => refreshListings(20, 0)}
        />
      }
    />
  );
}
```

---

### **Example 2: Home Screen (Featured Listings)**

```typescript
// app/(tabs)/index.tsx
import { useListings } from '@/context/ListingContent';

export default function HomeScreen() {
  const { listings, isLoading } = useListings();

  // Get first 5 listings for featured section
  const featuredListings = listings.slice(0, 5);

  return (
    <ScrollView>
      <Text className="text-2xl font-bold">Featured Stays</Text>
      {featuredListings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </ScrollView>
  );
}
```

---

### **Example 3: Listing Detail Screen**

```typescript
// app/listing/[id].tsx
import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useListings } from '@/context/ListingContent';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    selectedListing, 
    selectListing, 
    isLoading,
    toggleFavorite,
    isFavorite 
  } = useListings();

  useEffect(() => {
    if (id) {
      selectListing(id); // Fetch listing details
    }
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (!selectedListing) return <Text>Listing not found</Text>;

  return (
    <ScrollView>
      <Image source={{ uri: selectedListing.imageUrl }} />
      <Text className="text-3xl font-bold">{selectedListing.title}</Text>
      <Text className="text-xl">${selectedListing.price}/night</Text>
      <Text>{selectedListing.description}</Text>
      
      <TouchableOpacity onPress={() => toggleFavorite(id)}>
        <Ionicons 
          name={isFavorite(id) ? "heart" : "heart-outline"} 
          size={32} 
          color="red" 
        />
      </TouchableOpacity>

      {/* Reviews Section */}
      {Array.isArray(selectedListing.reviews) && (
        <View>
          <Text className="text-xl font-bold">Reviews</Text>
          {selectedListing.reviews.map((review, idx) => (
            <View key={idx} className="p-4 bg-gray-100 rounded-lg mb-2">
              <Text className="font-semibold">{review.reviewer_name}</Text>
              <Text>{review.comments}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
```

---

### **Example 4: Favorites Screen**

```typescript
// app/(tabs)/favorites.tsx
import { useListings } from '@/context/ListingContent';

export default function FavoritesScreen() {
  const { listings, favorites, isFavorite, toggleFavorite } = useListings();

  // Filter to only show favorited listings
  const favoriteListings = listings.filter(listing => isFavorite(listing.id));

  if (favoriteListings.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Ionicons name="heart-outline" size={64} color="gray" />
        <Text className="text-gray-500 mt-4">No favorites yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteListings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListingCard
          listing={item}
          onFavorite={() => toggleFavorite(item.id)}
          isFavorite={true}
        />
      )}
    />
  );
}
```

---

### **Example 5: Add Review**

```typescript
// In listing detail screen
import { useState } from 'react';
import { useListings } from '@/context/ListingContent';

export default function AddReviewSection({ listingId }: { listingId: string }) {
  const { addReview } = useListings();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await addReview(listingId, comment);
      Alert.alert('Success', 'Review added!');
      setComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">Add Review</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-3"
        placeholder="Share your experience..."
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-lg py-3 items-center"
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text className="text-white font-bold">
          {loading ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## 🔧 **Available Functions**

### **State (Read-Only)**
```typescript
const { 
  listings,         // ListingPreview[] - All listings
  selectedListing,  // ListingDetail | null - Currently viewed listing
  favorites,        // string[] - Array of favorite listing IDs
  isLoading,        // boolean - Loading state
  error            // string | null - Error message
} = useListings();
```

### **Actions (Functions)**
```typescript
const {
  // Refresh all listings
  refreshListings: (limit?: number, offset?: number) => Promise<void>

  // Load a specific listing's details
  selectListing: (listingId: string) => Promise<void>

  // Clear selected listing
  clearSelectedListing: () => void

  // Toggle favorite on/off
  toggleFavorite: (listingId: string) => void

  // Check if listing is favorited
  isFavorite: (listingId: string) => boolean

  // Add a review to a listing
  addReview: (listingId: string, comment: string) => Promise<void>
} = useListings();
```

---

## 🎨 **Component Example**

### **ListingCard Component**

```typescript
// components/listings/ListingCard.tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListingPreview } from '@/types/listing';

interface ListingCardProps {
  listing: ListingPreview;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function ListingCard({ 
  listing, 
  onPress, 
  onFavorite, 
  isFavorite 
}: ListingCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
    >
      {/* Image */}
      <Image 
        source={{ uri: listing.imageUrl }} 
        className="w-full h-48"
        resizeMode="cover"
      />

      {/* Favorite Button */}
      <TouchableOpacity 
        onPress={onFavorite}
        className="absolute top-2 right-2 bg-white rounded-full p-2"
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite ? "red" : "gray"} 
        />
      </TouchableOpacity>

      {/* Info */}
      <View className="p-4">
        <Text className="text-lg font-bold mb-1">{listing.title}</Text>
        <Text className="text-gray-600 mb-2">{listing.location}</Text>
        <Text className="text-xl font-bold text-blue-600">
          ${listing.price}/night
        </Text>
      </View>
    </TouchableOpacity>
  );
}
```

---

## ✅ **Benefits Recap**

1. **No Duplicate API Calls**
   - Listings loaded once
   - Shared across all screens

2. **Instant Navigation**
   - Data already cached
   - No loading delays

3. **Global Favorites**
   - Toggle anywhere
   - Persists across screens

4. **Pull to Refresh**
   - Works on any screen
   - Updates everywhere

5. **Cleaner Code**
   - No API logic in components
   - Just: `const { listings } = useListings()`

---

## 🚀 **Next Steps**

1. ✅ ListingContext created
2. ✅ Wrap app with provider
3. → Build ListingCard component
4. → Update Explore screen to use context
5. → Add Listing Detail screen
6. → Implement Favorites screen

Your listing system is ready to use! 🎉
