import { 
  ListingPreview, 
  ListingDetail, 
  CreateListingRequest, 
  UpdateListingRequest,
  AddReviewRequest 
} from "@/types/listing";
import { listingAPI } from "./apiClient";

/**
 * Get all listings with pagination
 * @param limit - Number of listings to fetch (default: 10)
 * @param offset - Number of listings to skip (default: 0)
 * @returns Promise<ListingPreview[]>
 */
export const getListings = async (
  limit: number = 10, 
  offset: number = 0
): Promise<ListingPreview[]> => {
  try {
    console.log(`🏠 listingService: Fetching listings (limit: ${limit}, offset: ${offset})...`);
    const response = await listingAPI.get<ListingPreview[]>('/listings', {
      params: { limit, offset }
    });
    console.log(`✅ listingService: Fetched ${response.data.length} listings`);
    return response.data;
  } catch (error) {
    console.error('❌ listingService: Error fetching listings:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific listing
 * @param listingId - The ID of the listing
 * @returns Promise<ListingDetail>
 */
export const getListing = async (listingId: string): Promise<ListingDetail> => {
  try {
    console.log(`🏠 listingService: Fetching listing details for ID: ${listingId}...`);
    const response = await listingAPI.get<ListingDetail>(`/listings/${listingId}`);
    console.log(`✅ listingService: Fetched listing: ${response.data.title}`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error fetching listing ${listingId}:`, error);
    throw error;
  }
};

/**
 * Create a new listing (Admin only)
 * @param listingData - The listing data to create
 * @returns Promise<{ id: string }>
 */
export const createListing = async (
  listingData: CreateListingRequest
): Promise<{ id: string }> => {
  try {
    console.log('🏠 listingService: Creating new listing...', listingData.name);
    const response = await listingAPI.post<{ id: string }>('/listings', listingData);
    console.log(`✅ listingService: Listing created with ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('❌ listingService: Error creating listing:', error);
    throw error;
  }
};

/**
 * Update an existing listing (Admin only)
 * @param listingId - The ID of the listing to update
 * @param listingData - The updated listing data
 * @returns Promise<{ status: string }>
 */
export const updateListing = async (
  listingId: string,
  listingData: UpdateListingRequest
): Promise<{ status: string }> => {
  try {
    console.log(`🏠 listingService: Updating listing ${listingId}...`);
    const response = await listingAPI.put<{ status: string }>(
      `/listings/${listingId}`,
      listingData
    );
    console.log(`✅ listingService: Listing ${listingId} updated successfully`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error updating listing ${listingId}:`, error);
    throw error;
  }
};

/**
 * Delete a listing (Admin only)
 * @param listingId - The ID of the listing to delete
 * @returns Promise<{ status: string }>
 */
export const deleteListing = async (listingId: string): Promise<{ status: string }> => {
  try {
    console.log(`🏠 listingService: Deleting listing ${listingId}...`);
    const response = await listingAPI.delete<{ status: string }>(`/listings/${listingId}`);
    console.log(`✅ listingService: Listing ${listingId} deleted successfully`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error deleting listing ${listingId}:`, error);
    throw error;
  }
};

/**
 * Add a review to a listing
 * @param listingId - The ID of the listing
 * @param reviewData - The review data
 * @returns Promise<{ status: string }>
 */
export const addReview = async (
  listingId: string,
  reviewData: AddReviewRequest
): Promise<{ status: string }> => {
  try {
    console.log(`🏠 listingService: Adding review to listing ${listingId}...`);
    const response = await listingAPI.post<{ status: string }>(
      `/listings/${listingId}/reviews`,
      reviewData
    );
    console.log(`✅ listingService: Review added to listing ${listingId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error adding review to listing ${listingId}:`, error);
    throw error;
  }
};

/**
 * Get all reviews for a listing (Admin only)
 * @param listingId - The ID of the listing
 * @returns Promise<any>
 */
export const getReviews = async (listingId: string): Promise<any> => {
  try {
    console.log(`🏠 listingService: Fetching reviews for listing ${listingId}...`);
    const response = await listingAPI.get(`/listings/${listingId}/reviews`);
    console.log(`✅ listingService: Fetched reviews for listing ${listingId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error fetching reviews for listing ${listingId}:`, error);
    throw error;
  }
};

/**
 * Delete a review from a listing (Admin only)
 * @param listingId - The ID of the listing
 * @param reviewId - The ID of the review to delete
 * @returns Promise<{ status: string; message: string }>
 */
export const deleteReview = async (
  listingId: string,
  reviewId: string
): Promise<{ status: string; message: string }> => {
  try {
    console.log(`🏠 listingService: Deleting review ${reviewId} from listing ${listingId}...`);
    const response = await listingAPI.delete<{ status: string; message: string }>(
      `/listings/${listingId}/reviews/${reviewId}`
    );
    console.log(`✅ listingService: Review ${reviewId} deleted from listing ${listingId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ listingService: Error deleting review:`, error);
    throw error;
  }
};

// Export all functions as a single object (optional, for easier imports)
export default {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  addReview,
  getReviews,
  deleteReview,
};