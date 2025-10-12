# Listing Service API Documentation

## ✅ Created Files

### 1. **Types** (`types/listing.ts`)
Updated with complete type definitions matching backend responses:
- `ListingPreview` - Basic listing info for list views
- `ListingDetail` - Full listing details including reviews
- `CreateListingRequest` - For creating new listings (admin)
- `UpdateListingRequest` - For updating listings (admin)
- `AddReviewRequest` - For adding reviews to listings
- `Review` - Review structure

### 2. **API Client** (`services/api/apiClient.ts`)
Updated to include:
- Token interceptor for `listingAPI` (automatically adds auth token)
- Error handling for listing API responses

### 3. **Listing Service** (`services/api/listingService.ts`)
Complete implementation with all CRUD operations:

## 📚 Available Functions

### **User Functions** (Require Authentication)

#### `getListings(limit?, offset?)`
Fetch a paginated list of listings.

```typescript
import { getListings } from '@/services/api/listingService';

// Get first 10 listings
const listings = await getListings();

// Get 20 listings starting from offset 10
const moreListings = await getListings(20, 10);
```

**Returns:** `ListingPreview[]`
```typescript
[
  {
    id: "10009999",
    title: "Beautiful Beach House",
    price: 150,
    location: "123 Beach St",
    imageUrl: "https://..."
  },
  ...
]
```

---

#### `getListing(listingId)`
Get detailed information about a specific listing.

```typescript
import { getListing } from '@/services/api/listingService';

const listing = await getListing('10009999');
console.log(listing.title, listing.description, listing.reviews);
```

**Returns:** `ListingDetail`
```typescript
{
  id: "10009999",
  title: "Beautiful Beach House",
  description: "Amazing ocean views...",
  price: 150,
  location: "123 Beach St",
  rating: 4.8,
  reviews: [
    {
      reviewer_name: "John Doe",
      comments: "Great place!",
      date: "2025-10-01"
    }
  ],
  imageUrl: "https://..."
}
```

---

#### `addReview(listingId, reviewData)`
Add a review to a listing.

```typescript
import { addReview } from '@/services/api/listingService';

const result = await addReview('10009999', {
  reviewer_id: '123',
  reviewer_name: 'Jane Smith',
  comments: 'Loved this place! Would recommend.',
  date: new Date().toISOString()
});
```

**Returns:** `{ status: "review added" }`

---

### **Admin Functions** (Require Admin Privileges)

#### `createListing(listingData)`
Create a new listing.

```typescript
import { createListing } from '@/services/api/listingService';

const newListing = await createListing({
  name: 'Cozy Downtown Apartment',
  description: 'Modern 2BR apartment in the heart of downtown',
  price: 120,
  property_type: 'Apartment',
  room_type: 'Entire home/apt',
  accommodates: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
  address: {
    street: '456 Main St',
    country: 'USA',
    country_code: 'US'
  },
  amenities: ['Wifi', 'Kitchen', 'Air conditioning'],
  images: {
    picture_url: 'https://example.com/image.jpg'
  }
});

console.log('Created listing ID:', newListing.id);
```

**Returns:** `{ id: string }`

---

#### `updateListing(listingId, updateData)`
Update an existing listing.

```typescript
import { updateListing } from '@/services/api/listingService';

await updateListing('10009999', {
  price: 180,
  description: 'Updated description...'
});
```

**Returns:** `{ status: "updated" }`

---

#### `deleteListing(listingId)`
Delete a listing.

```typescript
import { deleteListing } from '@/services/api/listingService';

await deleteListing('10009999');
```

**Returns:** `{ status: "deleted" }`

---

#### `getReviews(listingId)`
Get all reviews for a listing (admin only).

```typescript
import { getReviews } from '@/services/api/listingService';

const reviews = await getReviews('10009999');
```

---

#### `deleteReview(listingId, reviewId)`
Delete a specific review from a listing.

```typescript
import { deleteReview } from '@/services/api/listingService';

await deleteReview('10009999', 'review-123');
```

**Returns:** `{ status: "deleted", message: "..." }`

---

## 🎯 Usage Examples

### Example 1: Display Listings in Explore Screen

```typescript
import { useEffect, useState } from 'react';
import { getListings } from '@/services/api/listingService';
import { ListingPreview } from '@/types/listing';

export default function ExploreScreen() {
  const [listings, setListings] = useState<ListingPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings(20, 0);
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    // Render listings...
  );
}
```

---

### Example 2: Show Listing Details

```typescript
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getListing } from '@/services/api/listingService';
import { ListingDetail } from '@/types/listing';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setListing(data);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return (
    // Render listing details...
  );
}
```

---

### Example 3: Add a Review

```typescript
import { addReview } from '@/services/api/listingService';
import { useAuth } from '@/context/AuthContext';

export default function AddReviewComponent({ listingId }: { listingId: string }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    try {
      await addReview(listingId, {
        reviewer_id: user.id,
        reviewer_name: `${user.first_name} ${user.last_name}`,
        comments: comment,
        date: new Date().toISOString()
      });
      Alert.alert('Success', 'Review added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add review');
    }
  };

  return (
    // Render review form...
  );
}
```

---

## 🔒 Authentication

All endpoints require a valid authentication token. The token is automatically added to requests via the axios interceptor.

**How it works:**
1. User logs in → Token saved to AsyncStorage
2. API call made → Interceptor adds token to headers
3. Backend validates token → Returns data or error

**Error Handling:**
```typescript
try {
  const listings = await getListings();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.response?.status === 403) {
    // Forbidden - user doesn't have admin privileges
  } else {
    // Other error
  }
}
```

---

## 🐛 Debugging

All functions include console logging with emojis for easy tracking:
- 🏠 - Function called
- ✅ - Success
- ❌ - Error

**Example console output:**
```
🏠 listingService: Fetching listings (limit: 10, offset: 0)...
✅ listingService: Fetched 10 listings
```

---

## 🧪 Testing the API

### Quick Test Script

Create a test file to verify the API works:

```typescript
// test-listing-api.ts
import { getListings, getListing } from '@/services/api/listingService';

export async function testListingAPI() {
  try {
    console.log('Testing listing API...');
    
    // Test 1: Get listings
    const listings = await getListings(5);
    console.log('✅ Test 1 passed: Got', listings.length, 'listings');
    
    // Test 2: Get single listing
    if (listings.length > 0) {
      const detail = await getListing(listings[0].id);
      console.log('✅ Test 2 passed: Got listing details for', detail.title);
    }
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}
```

---

## 📝 Backend Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/listings` | User | Get all listings |
| GET | `/api/listings/:id` | User | Get listing details |
| POST | `/api/listings` | Admin | Create listing |
| PUT | `/api/listings/:id` | Admin | Update listing |
| DELETE | `/api/listings/:id` | Admin | Delete listing |
| POST | `/api/listings/:id/reviews` | User | Add review |
| GET | `/api/listings/:id/reviews` | Admin | Get all reviews |
| DELETE | `/api/listings/:id/reviews/:reviewId` | Admin | Delete review |

---

## ✨ Next Steps

Now that the API is ready, you can:

1. **Create ListingContext** - Global state management for listings
2. **Build Listing Components** - ListingCard, ListingList, etc.
3. **Update Explore Screen** - Show real listings from backend
4. **Create Detail Screen** - Full listing view with reviews
5. **Add Create/Edit Screens** - For admin users

The API layer is complete and ready to use! 🚀
