import React, { createContext, useContext, useState, useEffect } from "react";
import { ListingPreview, ListingDetail } from "@/types/listing";
import { 
  getListings as fetchListings, 
  getListing as fetchListing,
  addReview as addReviewAPI
} from "@/services/api/listingService";

// Define the context type
interface ListingContextType {
  // State
  listings: ListingPreview[];
  selectedListing: ListingDetail | null;
  favorites: string[]; // Array of listing IDs
  isLoading: boolean;
  error: string | null;

  // Actions
  refreshListings: (limit?: number, offset?: number) => Promise<void>;
  selectListing: (listingId: string) => Promise<void>;
  clearSelectedListing: () => void;
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  addReview: (listingId: string, comment: string, rating?: number) => Promise<void>;
}

const ListingContext = createContext<ListingContextType | null>(null);

export function ListingProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<ListingPreview[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingDetail | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial listings on mount
  useEffect(() => {
    const loadInitialListings = async () => {
      await refreshListings(20, 0);
    };
    
    loadInitialListings();
  }, []);

  // Refresh listings from API
  const refreshListings = async (limit: number = 20, offset: number = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🏠 ListingContext: Fetching listings...');
      const data = await fetchListings(limit, offset);
      setListings(data);
      console.log(`✅ ListingContext: Loaded ${data.length} listings`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load listings';
      setError(errorMessage);
      console.error('❌ ListingContext: Error loading listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a listing and fetch its details
  const selectListing = async (listingId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🏠 ListingContext: Fetching details for listing ${listingId}...`);
      const data = await fetchListing(listingId);
      setSelectedListing(data);
      console.log(`✅ ListingContext: Loaded listing: ${data.title}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load listing details';
      setError(errorMessage);
      console.error('❌ ListingContext: Error loading listing details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selected listing
  const clearSelectedListing = () => {
    setSelectedListing(null);
  };

  // Toggle favorite status
  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      if (prev.includes(listingId)) {
        console.log(`💔 ListingContext: Removed ${listingId} from favorites`);
        return prev.filter(id => id !== listingId);
      } else {
        console.log(`💖 ListingContext: Added ${listingId} to favorites`);
        return [...prev, listingId];
      }
    });
  };

  // Check if listing is favorited
  const isFavorite = (listingId: string): boolean => {
    return favorites.includes(listingId);
  };

  // Add a review to a listing
  const addReview = async (listingId: string, comment: string, rating?: number) => {
    try {
      console.log(`🏠 ListingContext: Adding review to listing ${listingId}...`);
      await addReviewAPI(listingId, {
        reviewer_id: 'current-user-id', // TODO: Get from AuthContext
        reviewer_name: 'Current User', // TODO: Get from AuthContext
        comments: comment,
        date: new Date().toISOString()
      });
      
      // Refresh the selected listing to show new review
      if (selectedListing?.id === listingId) {
        await selectListing(listingId);
      }
      
      console.log(`✅ ListingContext: Review added successfully`);
    } catch (err: any) {
      console.error('❌ ListingContext: Error adding review:', err);
      throw err;
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        selectedListing,
        favorites,
        isLoading,
        error,
        refreshListings,
        selectListing,
        clearSelectedListing,
        toggleFavorite,
        isFavorite,
        addReview,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

// Custom hook to use the ListingContext
export const useListings = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListings must be used within ListingProvider');
  }
  return context;
};
