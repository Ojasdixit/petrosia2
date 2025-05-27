import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MetaTags from "@/components/common/MetaTags";
import { PetListing } from "@shared/schema";
import { Loader2 } from "lucide-react";
import PetCard from "@/components/listing/PetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function PetsBirdsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState<PetListing[]>([]);
  
  // Fetch listings
  const { data: allListings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
  });
  
  // Filter for birds only and by search term
  useEffect(() => {
    if (allListings) {
      const birdListings = allListings.filter(listing => 
        listing.breed.toLowerCase().includes("bird") ||
        listing.title.toLowerCase().includes("bird") ||
        listing.description?.toLowerCase().includes("bird") ||
        listing.breed.toLowerCase().includes("parrot") ||
        listing.title.toLowerCase().includes("parrot") ||
        listing.description?.toLowerCase().includes("parrot") ||
        listing.breed.toLowerCase().includes("canary") ||
        listing.title.toLowerCase().includes("canary") ||
        listing.description?.toLowerCase().includes("canary")
      );
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        setFilteredListings(
          birdListings.filter(
            (listing) =>
              listing.title.toLowerCase().includes(lowerSearchTerm) ||
              listing.breed.toLowerCase().includes(lowerSearchTerm) ||
              listing.location.toLowerCase().includes(lowerSearchTerm) ||
              listing.description?.toLowerCase().includes(lowerSearchTerm)
          )
        );
      } else {
        setFilteredListings(birdListings);
      }
    }
  }, [allListings, searchTerm]);

  return (
    <>
      <MetaTags
        title="Birds for Sale and Adoption | Petrosia Pet Marketplace"
        description="Find beautiful, healthy birds of all varieties for your home. Browse our collection of parrots, canaries, finches, and other exotic birds for sale from trusted breeders."
        keywords="birds for sale India, pet birds, exotic birds, parrots for sale, canaries, finches, bird adoption, bird breeders, bird care, bird prices"
        url="https://petrosia.in/pets/birds"
        image="https://petrosia.in/images/birds-category-share.jpg"
      />
      
      <div className="bg-gradient-to-b from-green-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Birds</h1>
          <p className="text-gray-600">
            Discover beautiful, healthy birds of all varieties for your home
          </p>
          
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by species, type..."
                className="pr-12 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-green-500 hover:bg-green-600" 
                size="icon"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mb-10">
        {isLoading ? (
          <div className="min-h-[300px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((pet) => (
              <div key={pet.id} className="h-full">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No birds found</h3>
            <p className="text-gray-600">Try adjusting your search or check back later for new listings</p>
          </div>
        )}
      </div>
    </>
  );
}