import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { DogBreed } from "@shared/schema";
import { Loader2, Check, X, Activity, PawPrint, Award, Baby, Dog, Users, BadgePlus, Droplets, Scissors, Volume2 } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export default function DogBreedsComparePage() {
  const [selectedBreeds, setSelectedBreeds] = useState<number[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { data: allBreeds, isLoading: isLoadingAll } = useQuery<DogBreed[]>({
    queryKey: ["/api/dog-breeds"],
  });

  const { mutate: compareBreeds, data: comparisonResults, isPending: isComparing } = useMutation<
    DogBreed[],
    Error,
    number[]
  >({
    mutationFn: async (breedIds) => {
      const result = await apiRequest("POST", "/api/dog-breeds/compare", { breedIds });
      return await result.json();
    },
    onError: (error) => {
      toast({
        title: "Comparison failed",
        description: "Failed to compare breeds. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddBreed = (breedId: string) => {
    const id = parseInt(breedId);
    if (selectedBreeds.includes(id)) {
      toast({
        title: "Already selected",
        description: "This breed is already in your comparison list.",
      });
      return;
    }
    
    if (selectedBreeds.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 breeds at a time.",
      });
      return;
    }
    
    setSelectedBreeds([...selectedBreeds, id]);
  };

  const handleRemoveBreed = (breedId: number) => {
    setSelectedBreeds(selectedBreeds.filter(id => id !== breedId));
  };

  const handleCompare = () => {
    if (selectedBreeds.length < 2) {
      toast({
        title: "Not enough breeds selected",
        description: "Please select at least 2 breeds to compare.",
      });
      return;
    }
    
    compareBreeds(selectedBreeds);
  };

  const renderRatingBar = (value: number) => (
    <Progress value={value * 20} className="h-2" />
  );

  if (isLoadingAll) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!allBreeds) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <TypographyH1 className="mb-4">Error Loading Breeds</TypographyH1>
        <TypographyP className="mb-6">Sorry, we couldn't load the dog breeds information.</TypographyP>
        <Link href="/dog-breeds">
          <Button>Back to All Breeds</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dog-breeds">Dog Breeds</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Compare Breeds</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="bg-gradient-to-r from-amber-100 to-yellow-200 dark:from-amber-900 dark:to-yellow-800 p-6 md:p-10 rounded-xl mb-8">
        <TypographyH1 className="text-center mb-2">Compare Dog Breeds</TypographyH1>
        <TypographyP className="text-center md:w-3/4 mx-auto">
          Compare different dog breeds side by side to find the perfect match for your lifestyle.
          See how breeds stack up against each other in terms of temperament, care requirements, and physical characteristics.
        </TypographyP>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Breeds to Compare</CardTitle>
          <CardDescription>Choose up to 3 breeds to compare side by side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Add a breed</label>
              <Select onValueChange={handleAddBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allBreeds.map((breed) => (
                      <SelectItem key={breed.id} value={breed.id.toString()}>
                        {breed.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Selected breeds ({selectedBreeds.length}/3)</label>
              <div className="flex flex-wrap gap-2">
                {selectedBreeds.map((breedId) => {
                  const breed = allBreeds.find(b => b.id === breedId);
                  return breed ? (
                    <Badge key={breedId} variant="secondary" className="pl-2 pr-1 py-1">
                      {breed.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 ml-1"
                        onClick={() => handleRemoveBreed(breedId)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ) : null;
                })}
                {selectedBreeds.length === 0 && (
                  <span className="text-muted-foreground text-sm">No breeds selected yet</span>
                )}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleCompare}
            disabled={selectedBreeds.length < 2 || isComparing}
            className="w-full md:w-auto"
          >
            {isComparing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compare {selectedBreeds.length} Breeds
          </Button>
        </CardContent>
      </Card>

      {comparisonResults && comparisonResults.length > 0 && (
        <div className="mb-8">
          <TypographyH2 className="mb-6">Breed Comparison</TypographyH2>
          
          <div className="overflow-x-auto pb-4">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border-b text-left font-medium text-muted-foreground w-1/4"></th>
                  {comparisonResults.map((breed) => (
                    <th key={breed.id} className="p-3 border-b text-center">
                      <div className="mb-2 h-32 overflow-hidden rounded-lg">
                        <img
                          src={breed.mainImage}
                          alt={breed.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-lg">{breed.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b font-medium">Origin</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.origin}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Group</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.group}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Size</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.size}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Male Weight</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.maleWeight} kg</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Female Weight</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.femaleWeight} kg</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Coat Type</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.coat}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Life Expectancy</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">{breed.lifeExpectancy} years</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 border-b font-medium">Popularity Rank</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b text-center">#{breed.popularity}</td>
                  ))}
                </tr>
                
                {/* Traits section */}
                <tr>
                  <td colSpan={comparisonResults.length + 1} className="p-3 border-b bg-muted/30">
                    <span className="font-bold text-lg">Temperament & Care Needs</span>
                  </td>
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Energy Level
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.energyLevel}/5</span>
                        {renderRatingBar(breed.energyLevel)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <PawPrint className="w-4 h-4 mr-2" />
                      Exercise Needs
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.exerciseNeeds}/5</span>
                        {renderRatingBar(breed.exerciseNeeds)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Trainability
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.trainability}/5</span>
                        {renderRatingBar(breed.trainability)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Baby className="w-4 h-4 mr-2" />
                      Good with Children
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.goodWithChildren}/5</span>
                        {renderRatingBar(breed.goodWithChildren)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Dog className="w-4 h-4 mr-2" />
                      Good with Other Dogs
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.goodWithOtherDogs}/5</span>
                        {renderRatingBar(breed.goodWithOtherDogs)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Good with Strangers
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.goodWithStrangers}/5</span>
                        {renderRatingBar(breed.goodWithStrangers)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <BadgePlus className="w-4 h-4 mr-2" />
                      Shedding Amount
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.sheddingAmount}/5</span>
                        {renderRatingBar(breed.sheddingAmount)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2" />
                      Drooling Amount
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.droolingAmount}/5</span>
                        {renderRatingBar(breed.droolingAmount)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Scissors className="w-4 h-4 mr-2" />
                      Grooming Needs
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.groomingNeeds}/5</span>
                        {renderRatingBar(breed.groomingNeeds)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">
                    <div className="flex items-center">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Barking Level
                    </div>
                  </td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">{breed.barkingAmount}/5</span>
                        {renderRatingBar(breed.barkingAmount)}
                      </div>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="p-3 border-b font-medium">Temperament</td>
                  {comparisonResults.map((breed) => (
                    <td key={breed.id} className="p-3 border-b">
                      <div className="flex flex-wrap justify-center gap-1">
                        {breed.temperament.slice(0, 4).map((trait, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td colSpan={comparisonResults.length + 1} className="p-3">
                    <div className="flex justify-center gap-4 mt-2">
                      {comparisonResults.map((breed) => (
                        <Link key={breed.id} href={`/dog-breeds/${breed.id}`}>
                          <Button variant="outline" size="sm">
                            {breed.name} Details
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}