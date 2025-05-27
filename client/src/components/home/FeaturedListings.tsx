import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PetListing } from "@shared/schema";
import PetCard from "../listing/PetCard";
import { ArrowRight, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PET_TYPES = [
  { value: "all", label: "All Pets" },
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
  { value: "other", label: "Other Pets" }
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "closest", label: "Closest" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "price-low-high", label: "Price: Low to High" }
];

const FeaturedListings = () => {
  const [featuredPets, setFeaturedPets] = useState<PetListing[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [petType, setPetType] = useState("all");
  const [breedFilter, setBreedFilter] = useState("all");
  const [filteredPets, setFilteredPets] = useState<PetListing[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: listings, isLoading } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
  });

  // Get unique breeds (filtering out empty/undefined breeds)
  const uniqueBreeds = listings
    ? ["all", ...Array.from(new Set(listings
        .filter(pet => pet.breed && pet.breed.trim() !== "")
        .map((pet) => pet.breed)))]
    : ["all"];

  // Filter and sort pets
  useEffect(() => {
    if (listings && listings.length > 0) {
      // First, apply basic filtering
      let filtered = [...listings];
      
      // Filter by pet type (would need a pet type field in the actual data)
      if (petType !== "all") {
        // This is a placeholder - you would need to add a petType field to your schema
        // filtered = filtered.filter(pet => pet.petType === petType);
      }
      
      // Filter by breed
      if (breedFilter !== "all") {
        filtered = filtered.filter(pet => pet.breed === breedFilter);
      }
      
      // Apply sorting
      switch (sortOption) {
        case "newest":
          // Sort by creation date (newest first)
          filtered.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case "closest":
          // This would require geolocation logic
          // For now, we'll just sort by location name alphabetically
          filtered.sort((a, b) => a.location.localeCompare(b.location));
          break;
        case "price-high-low":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "price-low-high":
          filtered.sort((a, b) => a.price - b.price);
          break;
        default:
          break;
      }
      
      // Update the filtered pets
      setFilteredPets(filtered);
      
      // Set featured pets (display up to 6)
      setFeaturedPets(filtered.slice(0, 6));
    }
  }, [listings, sortOption, petType, breedFilter]);

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
              Featured Puppies
            </h2>
            <p className="mt-2 text-neutral-600">
              Explore our curated selection of healthy, happy puppies
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/pets"
              className="text-primary hover:text-primary-dark font-medium flex items-center"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Pet Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PET_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={breedFilter} onValueChange={setBreedFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Breed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Breeds</SelectItem>
                    {uniqueBreeds
                      .filter(breed => breed !== "all" && breed !== "" && breed !== undefined)
                      .map(breed => (
                        <SelectItem key={breed} value={breed || "unknown"}>
                          {breed || "Unknown"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div 
                key={skeleton} 
                className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-56 bg-neutral-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full"></div>
                  <div className="h-8 bg-neutral-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} featured={pet.id % 2 === 0} isNew={pet.id % 3 === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-neutral-600">No pet listings available at the moment. Please check back later.</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/pets"
            className="text-primary hover:text-primary-dark font-medium inline-flex items-center"
          >
            View All Puppies <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
