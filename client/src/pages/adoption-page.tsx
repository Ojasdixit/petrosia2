import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet";
import { AdoptionListing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import {
  Search,
  Filter,
  MapPin,
  Calendar,
  PawPrint,
  Heart,
  ChevronRight,
  InfoIcon,
  ArrowUpDown,
} from "lucide-react";

import AdoptionCard from "@/components/adoption/AdoptionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdoptionPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isVaccinated, setIsVaccinated] = useState<boolean | null>(null);
  const [isNeutered, setIsNeutered] = useState<boolean | null>(null);
  const [hasSpecialNeeds, setHasSpecialNeeds] = useState<boolean | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeFilters, setActiveFilters] = useState<number>(0);

  // Fetch adoption listings
  const { data: adoptionListings, isLoading } = useQuery<AdoptionListing[]>({
    queryKey: ["/api/adoption-listings"],
  });

  // Update the active filters count
  useEffect(() => {
    let count = 0;
    if (selectedPetType) count++;
    if (selectedAgeRange) count++;
    if (selectedLocation) count++;
    if (isVaccinated !== null) count++;
    if (isNeutered !== null) count++;
    if (hasSpecialNeeds !== null) count++;
    if (gender) count++;
    setActiveFilters(count);
  }, [
    selectedPetType,
    selectedAgeRange,
    selectedLocation,
    isVaccinated,
    isNeutered,
    hasSpecialNeeds,
    gender,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedPetType(null);
    setSelectedAgeRange(null);
    setSelectedLocation(null);
    setIsVaccinated(null);
    setIsNeutered(null);
    setHasSpecialNeeds(null);
    setGender(null);
  };

  // Convert age range to months for filtering
  const getAgeRangeInMonths = (range: string): [number, number] => {
    switch (range) {
      case "puppy":
        return [0, 12]; // 0-12 months
      case "young":
        return [13, 36]; // 1-3 years
      case "adult":
        return [37, 96]; // 3-8 years
      case "senior":
        return [97, 999]; // 8+ years
      default:
        return [0, 999];
    }
  };

  // Filter and sort the listings
  const filteredListings = adoptionListings
    ? adoptionListings
        .filter((listing) => {
          // Status filter - only show available and pending
          if (listing.status === "adopted") return false;

          // Search query
          if (
            searchQuery &&
            !listing.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !listing.breed.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !listing.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return false;
          }

          // Pet type filter
          if (selectedPetType && listing.petType !== selectedPetType) {
            return false;
          }

          // Age range filter
          if (selectedAgeRange) {
            const [minMonths, maxMonths] = getAgeRangeInMonths(selectedAgeRange);
            if (listing.age < minMonths || listing.age > maxMonths) {
              return false;
            }
          }

          // Location filter
          if (
            selectedLocation &&
            !listing.location.toLowerCase().includes(selectedLocation.toLowerCase())
          ) {
            return false;
          }

          // Vaccinated filter
          if (isVaccinated !== null && listing.isVaccinated !== isVaccinated) {
            return false;
          }

          // Neutered filter
          if (isNeutered !== null && listing.isNeutered !== isNeutered) {
            return false;
          }

          // Special needs filter
          if (
            hasSpecialNeeds !== null &&
            (hasSpecialNeeds ? !listing.specialNeeds : listing.specialNeeds)
          ) {
            return false;
          }

          // Gender filter
          if (gender && listing.gender.toLowerCase() !== gender.toLowerCase()) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case "newest":
              return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
            case "oldest":
              return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
            case "name_asc":
              return a.name.localeCompare(b.name);
            case "name_desc":
              return b.name.localeCompare(a.name);
            case "age_asc":
              return a.age - b.age;
            case "age_desc":
              return b.age - a.age;
            default:
              return 0;
          }
        })
    : [];

  // Get locations from listings
  const locationsSet = new Set<string>();
  if (adoptionListings) {
    adoptionListings.forEach(listing => {
      // Return the first part of the location (usually the city)
      locationsSet.add(listing.location.split(",")[0].trim());
    });
  }
  const locations = Array.from(locationsSet);

  return (
    <>
      <Helmet>
        <title>Adopt a Pet - Find Your New Companion | Petrosia</title>
        <meta
          name="description"
          content="Browse pets available for adoption. Find dogs, cats, and other animals looking for their forever homes."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Adoption Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your perfect companion among our available pets looking for forever homes.
            Each adoption helps a pet in need and makes room for us to rescue another.
          </p>
        </div>

        {/* Admin adoption posting button */}
        {user && user.role === "admin" && (
          <div className="mb-8 flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/admin/add-adoption")}
              className="gap-2"
            >
              <PawPrint className="h-4 w-4" />
              Add Pet for Adoption
            </Button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, breed, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge className="ml-1 bg-primary text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Pets</SheetTitle>
                  <SheetDescription>
                    Narrow down your search with these filters.
                  </SheetDescription>
                </SheetHeader>

                <div className="py-4">
                  <Button
                    variant="ghost"
                    className="text-sm px-2 h-8"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </Button>
                </div>

                <Separator className="my-2" />

                <Accordion type="multiple" defaultValue={["pet_type", "age", "location", "health"]} className="w-full">
                  <AccordionItem value="pet_type">
                    <AccordionTrigger>Pet Type</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {["dog", "cat", "bird", "fish", "small_pet", "other"].map((type) => (
                          <div
                            key={type}
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              selectedPetType === type
                                ? "border-primary bg-primary/10"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => setSelectedPetType(selectedPetType === type ? null : type)}
                          >
                            <div className="font-medium capitalize">
                              {type === "small_pet" ? "Small Pet" : type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="age">
                    <AccordionTrigger>Age</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "puppy", label: "Puppy/Kitten (< 1 year)" },
                          { value: "young", label: "Young (1-3 years)" },
                          { value: "adult", label: "Adult (3-8 years)" },
                          { value: "senior", label: "Senior (8+ years)" },
                        ].map((age) => (
                          <div
                            key={age.value}
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              selectedAgeRange === age.value
                                ? "border-primary bg-primary/10"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => setSelectedAgeRange(selectedAgeRange === age.value ? null : age.value)}
                          >
                            <div className="font-medium">{age.label}</div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="location">
                    <AccordionTrigger>Location</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {locations.map((loc) => (
                          <div
                            key={loc}
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              selectedLocation === loc
                                ? "border-primary bg-primary/10"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                          >
                            <div className="font-medium">{loc}</div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="health">
                    <AccordionTrigger>Health & Care</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vaccinated"
                          checked={isVaccinated === true}
                          onCheckedChange={(checked) => 
                            setIsVaccinated(checked === "indeterminate" ? null : checked === true)
                          }
                        />
                        <Label htmlFor="vaccinated">Vaccinated</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="neutered"
                          checked={isNeutered === true}
                          onCheckedChange={(checked) => 
                            setIsNeutered(checked === "indeterminate" ? null : checked === true)
                          }
                        />
                        <Label htmlFor="neutered">Neutered/Spayed</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="specialNeeds"
                          checked={hasSpecialNeeds === true}
                          onCheckedChange={(checked) => 
                            setHasSpecialNeeds(checked === "indeterminate" ? null : checked === true)
                          }
                        />
                        <Label htmlFor="specialNeeds">Special Needs</Label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="gender">
                    <AccordionTrigger>Gender</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {["male", "female"].map((gen) => (
                          <div
                            key={gen}
                            className={`border rounded-md p-3 cursor-pointer transition-colors ${
                              gender === gen
                                ? "border-primary bg-primary/10"
                                : "hover:border-gray-400"
                            }`}
                            onClick={() => setGender(gender === gen ? null : gen)}
                          >
                            <div className="font-medium capitalize">{gen}</div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] gap-1">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                <SelectItem value="age_asc">Age (Youngest)</SelectItem>
                <SelectItem value="age_desc">Age (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applied Filters */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedPetType && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span className="capitalize">{selectedPetType === "small_pet" ? "Small Pet" : selectedPetType}</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setSelectedPetType(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {selectedAgeRange && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span>
                  {selectedAgeRange === "puppy"
                    ? "Puppy/Kitten"
                    : selectedAgeRange === "young"
                    ? "Young"
                    : selectedAgeRange === "adult"
                    ? "Adult"
                    : "Senior"}
                </span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setSelectedAgeRange(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {selectedLocation && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span>{selectedLocation}</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setSelectedLocation(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {isVaccinated !== null && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span>Vaccinated</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setIsVaccinated(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {isNeutered !== null && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span>Neutered/Spayed</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setIsNeutered(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {hasSpecialNeeds !== null && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span>Special Needs</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setHasSpecialNeeds(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            {gender && (
              <Badge variant="outline" className="flex items-center gap-1 p-2">
                <span className="capitalize">{gender}</span>
                <button 
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5" 
                  onClick={() => setGender(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {!isLoading && (
              filteredListings.length === 0 ? (
                <span>No pets found matching your criteria</span>
              ) : (
                <span>Showing {filteredListings.length} pet{filteredListings.length !== 1 ? "s" : ""}</span>
              )
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <InfoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pets Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any pets matching your search criteria. Try adjusting your filters or check back later.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pets Grid */}
        {!isLoading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map((pet) => (
              <AdoptionCard 
                key={pet.id} 
                pet={pet} 
                isNew={
                  pet.createdAt ? 
                  (new Date().getTime() - new Date(pet.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000 : 
                  false
                } 
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Even if you can't adopt, you can still make a difference. Consider donating, volunteering, 
            or fostering to help pets in need.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline">Learn About Fostering</Button>
            <Button>Donate to Help Animals</Button>
          </div>
        </div>
      </div>
    </>
  );
}