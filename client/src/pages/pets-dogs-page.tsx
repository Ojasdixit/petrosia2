import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PetListing } from "@shared/schema";
import MetaTags from "@/components/common/MetaTags";
import PetListingCard from "@/components/listing/PetListingCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PetsDogsPage() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high">("recent");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [filteredListings, setFilteredListings] = useState<PetListing[]>([]);
  
  // List of Indian cities for the filter
  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Kolkata", "Ahmedabad", 
    "Pune", "Chennai", "Noida", "Gurugram", "Jaipur", 
    "Lucknow", "Hyderabad", "Chandigarh", "Cochin"
  ];

  const { data: listings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
    select: (data) => {
      // Filter for dog listings only
      const dogListings = data.filter(listing => listing.petType === "dog" && listing.approved);
      
      // Sort listings based on sortBy
      return [...dogListings].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        // Default: sort by most recent (createdAt)
        return new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime();
      });
    }
  });
  
  // Apply filters
  useEffect(() => {
    if (!listings) return;
    
    let filtered = [...listings];
    
    // Apply breed filter
    if (selectedBreed && selectedBreed !== "all") {
      filtered = filtered.filter(listing => listing.breed === selectedBreed);
    }
    
    // Apply city filter
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter(listing => listing.location.includes(selectedCity));
    }
    
    setFilteredListings(filtered);
  }, [listings, selectedBreed, selectedCity]);

  return (
    <>
      <MetaTags
        title="Dogs and Puppies for Sale | Petrosia"
        description="Browse dogs and puppies for sale or adoption from verified sellers on Petrosia. Find your perfect canine companion from various breeds across India."
        keywords="dogs for sale India, puppies for sale, dog adoption, dog breeders, pet dogs, buy puppies India, premium dog breeds, dog pets, puppy adoption"
        url="https://petrosia.in/pets/dogs"
        image="https://petrosia.in/images/dogs-category-share.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pets/dogs">Dogs</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Dogs</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Browse our selection of puppies and dogs from verified breeders and sellers across India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Available Dogs</h2>
          
          <div className="flex flex-wrap gap-2 items-center">
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
            
            {/* Breed Selection */}
            <Select value={selectedBreed} onValueChange={setSelectedBreed}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All Breeds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                {listings && Array.from(new Set(listings.map(listing => listing.breed))).sort().map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* City Selection */}
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings && listings.length > 0 ? (
          <>
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-2">No Matching Dogs Found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedBreed("all");
                    setSelectedCity("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="relative">
                    <PetListingCard listing={listing} showViewDetailsButton />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <div className="bg-white/70 text-xs px-1.5 py-0.5 rounded text-gray-700 font-medium">
                        ❤️ {Math.floor(10 + Math.random() * 90)}
                      </div>
                      <div className="bg-white/70 text-xs px-1.5 py-0.5 rounded text-gray-700 font-medium">
                        💬 {Math.floor(5 + Math.random() * 15)} enquiries
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No dog listings found</h3>
            {user && user.role === "seller" && (
              <Link href="/seller/add-listing">
                <Button>Add a Listing</Button>
              </Link>
            )}
          </div>
        )}

        <div className="mt-16 bg-neutral-100 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Looking for Dog Breed Information?</h2>
            <p className="mb-6 text-neutral-600">
              Learn about different dog breeds, their temperaments, care requirements, and more in our comprehensive dog breeds guide.
            </p>
            <Link href="/dog-breeds">
              <Button>Browse Dog Breeds</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}