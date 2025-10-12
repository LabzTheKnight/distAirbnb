// Listing types matching backend response format

export interface Review {
  id?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  comments: string;
  date?: string;
}

// Basic listing info (from GET /listings)
export interface ListingPreview {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
}

// Detailed listing info (from GET /listings/:id)
export interface ListingDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  reviews: Review[] | string;
  imageUrl: string;
}

// For creating/updating listings (admin only)
export interface CreateListingRequest {
  name: string;
  description?: string;
  price: number;
  property_type?: string;
  room_type?: string;
  accommodates?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  address?: {
    street?: string;
    suburb?: string;
    government_area?: string;
    market?: string;
    country?: string;
    country_code?: string;
  };
  amenities?: string[];
  images?: {
    picture_url?: string;
  };
  [key: string]: any; // Allow additional dynamic fields
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {}

// Add review to listing
export interface AddReviewRequest {
  reviewer_id: string;
  reviewer_name?: string;
  comments: string;
  date?: string;
}

// API Response types
export interface ListingsResponse {
  data: ListingPreview[];
  total?: number;
}

export interface ListingResponse {
  data: ListingDetail;
}

// Legacy type for backward compatibility
type Dynamic = { [key: string]: unknown };

export type Listing = Dynamic & {
  id: string;
  title: string;
  city?: string;
  country?: string;
  pricePerNight?: number;
  rating?: number;
  photos?: string[];
  amenities?: string[];
  createdAt?: string;
};
