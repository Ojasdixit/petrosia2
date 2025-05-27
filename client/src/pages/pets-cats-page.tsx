import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MetaTags from "@/components/common/MetaTags";
import { PetListing } from "@shared/schema";
import { Loader2 } from "lucide-react";
import PetCard from "@/components/listing/PetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function PetsCatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState<PetListing[]>([]);
  
  // Fetch listings
  const { data: allListings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
  });
  
  // Filter for cats only and by search term
  useEffect(() => {
    if (allListings) {
      const catListings = allListings.filter(listing => 
        listing.breed.toLowerCase().includes("cat") ||
        listing.title.toLowerCase().includes("cat") ||
        listing.description?.toLowerCase().includes("cat")
      );
      
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        setFilteredListings(
          catListings.filter(
            (listing) =>
              listing.title.toLowerCase().includes(lowerSearchTerm) ||
              listing.breed.toLowerCase().includes(lowerSearchTerm) ||
              listing.location.toLowerCase().includes(lowerSearchTerm) ||
              listing.description?.toLowerCase().includes(lowerSearchTerm)
          )
        );
      } else {
        setFilteredListings(catListings);
      }
    }
  }, [allListings, searchTerm]);

  return (
    <>
      <MetaTags
        title="Cats and Kittens for Sale | Petrosia Pet Marketplace"
        description="Find the perfect cat or kitten for your home from our selection of purebred and mixed breed cats. Browse cats of all ages, colors, and personalities."
        keywords="cats for sale India, kittens for sale, cat adoption, Persian cats, Bengal cats, Siamese cats, Maine Coon, cat prices, buy cats online, cat breeds"
        url="https://petrosia.in/pets/cats"
        image="https://petrosia.in/images/cats-category-share.jpg"
      />
      
      <div className="bg-gradient-to-b from-orange-50 to-white py-8 mb-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cats</h1>
          <p className="text-gray-600">
            Find your perfect feline companion from our curated selection of cats and kittens
          </p>
          
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by breed, location..."
                className="pr-12 py-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                className="absolute top-0 right-0 h-full rounded-l-none bg-orange-500 hover:bg-orange-600" 
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
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
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
            <h3 className="text-xl font-medium text-gray-800 mb-2">No cats found</h3>
            <p className="text-gray-600">Try adjusting your search or check back later for new listings</p>
          </div>
        )}
      </div>
    </>
  );
}