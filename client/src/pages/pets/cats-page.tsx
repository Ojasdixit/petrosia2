import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PetListing } from "@shared/schema";
import PetTypeHeader from "@/components/pets/PetTypeHeader";
import PetListingCard from "@/components/listing/PetListingCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CatsPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high">("recent");

  const { data: listings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
    select: (data) => {
      // Filter for cat listings only
      const catListings = data.filter(listing => listing.petType === "cat" && listing.approved);
      
      // Sort listings based on sortBy
      return [...catListings].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        // Default: sort by most recent (createdAt)
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PetTypeHeader activeType="cat" />
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Cats</h2>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={sortBy === "recent" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              Most Recent
            </Button>
            <Button 
              variant={sortBy === "price-low" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSortBy("price-low")}
            >
              Price: Low to High
            </Button>
            <Button 
              variant={sortBy === "price-high" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSortBy("price-high")}
            >
              Price: High to Low
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <PetListingCard key={listing.id} listing={listing} showViewDetailsButton />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No cat listings found</h3>
            {user && user.role === "seller" && (
              <Link href="/seller/add-listing">
                <Button>Add a Listing</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}