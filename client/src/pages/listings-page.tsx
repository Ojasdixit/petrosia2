import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { PetListing } from "@shared/schema";
import PetCard from "@/components/listing/PetCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter } from "lucide-react";

const ListingsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredListings, setFilteredListings] = useState<PetListing[]>([]);
  const [locationFilter, setLocationFilter] = useState("all_locations");
  const [breedFilter, setBreedFilter] = useState("all_breeds");
  const [ageFilter, setAgeFilter] = useState("all_ages");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch all pet listings
  const { data: listings, isLoading, isError } = useQuery<PetListing[]>({
    queryKey: ["/api/pet-listings"],
  });

  // Handle search and filtering
  useEffect(() => {
    if (listings) {
      let filtered = [...listings];

      // Search by breed or description
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (pet) =>
            pet.breed.toLowerCase().includes(term) ||
            pet.title.toLowerCase().includes(term) ||
            pet.description.toLowerCase().includes(term)
        );
      }

      // Filter by location
      if (locationFilter && locationFilter !== "all_locations") {
        filtered = filtered.filter((pet) =>
          pet.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      // Filter by breed
      if (breedFilter && breedFilter !== "all_breeds") {
        filtered = filtered.filter((pet) =>
          pet.breed.toLowerCase().includes(breedFilter.toLowerCase())
        );
      }

      // Filter by age
      if (ageFilter && ageFilter !== "all_ages") {
        if (ageFilter === "0-3") {
          filtered = filtered.filter((pet) => pet.age <= 3);
        } else if (ageFilter === "3-6") {
          filtered = filtered.filter((pet) => pet.age > 3 && pet.age <= 6);
        } else if (ageFilter === "6+") {
          filtered = filtered.filter((pet) => pet.age > 6);
        }
      }

      setFilteredListings(filtered);
    }
  }, [listings, searchTerm, locationFilter, breedFilter, ageFilter]);

  // Extract unique locations for filter dropdown
  const uniqueLocations = listings
    ? [...new Set(listings.map((pet) => pet.location))]
    : [];

  // Extract unique breeds for filter dropdown
  const uniqueBreeds = listings
    ? [...new Set(listings.map((pet) => pet.breed))]
    : [];

  return (
    <>
      <Helmet>
        <title>Find Puppies - Petrosia</title>
        <meta name="description" content="Browse our curated selection of healthy, happy puppies from verified breeders across India." />
      </Helmet>

      <div className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-4">
              Find Your Perfect Puppy
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Browse our curated selection of healthy, happy puppies from
              verified breeders across India.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <Input
                  placeholder="Search by breed, title, or description"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="md:w-auto"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>

            {/* Filters - Expandable Section */}
            {isFilterOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Location
                  </label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_locations">All Locations</SelectItem>
                      {uniqueLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Breed
                  </label>
                  <Select value={breedFilter} onValueChange={setBreedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_breeds">All Breeds</SelectItem>
                      {uniqueBreeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Age
                  </label>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_ages">All Ages</SelectItem>
                      <SelectItem value="0-3">0-3 Months</SelectItem>
                      <SelectItem value="3-6">3-6 Months</SelectItem>
                      <SelectItem value="6+">6+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Pet Listings Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                Sorry, we couldn't load the pet listings. Please try again later.
              </p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-neutral-100 p-6 rounded-full mb-4">
                  <Search className="h-8 w-8 text-neutral-400" />
                </div>
                <h2 className="text-xl font-heading font-semibold mb-2">No listings found</h2>
                <p className="text-neutral-600 max-w-md mb-6">
                  We couldn't find any pet listings matching your search criteria. 
                  Try adjusting your filters or check back later.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all_locations");
                    setBreedFilter("all_breeds");
                    setAgeFilter("all_ages");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-neutral-600">
                  {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"} found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ListingsPage;
