import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { PetListing, PetSpecies } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import PetTypeHeader from "@/components/pets/PetTypeHeader";
import PetListingCard from "@/components/listing/PetListingCard";

interface PetListingsPageProps {
  petType: PetSpecies;
}

const PetListingsPage: React.FC<PetListingsPageProps> = ({ petType }) => {
  const [, setLocation] = useLocation();

  // Fetch pet listings filtered by type
  const {
    data: listings,
    isLoading,
    error,
  } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings", { petType }],
    queryFn: async ({ queryKey }) => {
      const [_, { petType }] = queryKey as [string, { petType: PetSpecies }];
      const response = await fetch(`/api/pet-listings?petType=${petType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      return response.json();
    },
  });

  const petTypeTitle = () => {
    switch (petType) {
      case "dog":
        return "Dogs";
      case "cat":
        return "Cats";
      case "bird":
        return "Birds";
      case "fish":
        return "Fish";
      default:
        return "Pets";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PetTypeHeader activeType={petType} />
      
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{petTypeTitle()} for Sale</h1>
          <Button onClick={() => setLocation("/pets/search")}>
            Advanced Search
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>Error loading listings. Please try again later.</p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <PetListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted rounded-md">
            <h3 className="text-xl font-medium mb-2">No {petTypeTitle()} Available</h3>
            <p className="text-muted-foreground mb-4">
              We don't have any {petTypeTitle().toLowerCase()} listings at the moment. Please check back later.
            </p>
            <Button onClick={() => setLocation("/")}>
              Browse All Pets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListingsPage;