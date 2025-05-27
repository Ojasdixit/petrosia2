import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { DogBreed, DogTemperament } from "@shared/schema";
import { Loader2, Heart, Activity, PawPrint, Ruler, Scale, Clock, Shapes, Thermometer, Award, Users, Dog, Baby, BadgePlus, Volume2, Droplets, Scissors, AlertTriangle } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP } from "@/components/ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import PuppyCarousel from "@/components/breeds/PuppyCarousel";

export default function DogBreedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const breedId = parseInt(id);
  
  const { data: breed, isLoading, error } = useQuery<DogBreed>({
    queryKey: [`/api/dog-breeds/${breedId}`],
  });

  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !breed) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <TypographyH1 className="mb-4">Breed Not Found</TypographyH1>
        <TypographyP className="mb-6">Sorry, we couldn't find information about this dog breed.</TypographyP>
        <Link href="/dog-breeds">
          <Button>Back to All Breeds</Button>
        </Link>
      </div>
    );
  }

  const renderRatingBar = (value: number, label: string, icon: React.ReactNode) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm">{value}/5</span>
      </div>
      <Progress value={value * 20} className="h-2" />
    </div>
  );

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
          <BreadcrumbLink>{breed.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden mb-6">
            <img 
              src={breed.mainImage} 
              alt={breed.name} 
              className="w-full h-[300px] md:h-[400px] object-cover object-center"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="outline" className="text-sm">
              <Shapes className="w-4 h-4 mr-1" />
              {breed.group} Group
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Ruler className="w-4 h-4 mr-1" />
              {breed.size} Size
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {breed.lifeExpectancy} years lifespan
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Award className="w-4 h-4 mr-1" />
              #{breed.popularity} in India
            </Badge>
          </div>
          
          {/* Puppy Carousel - displays available puppies of this breed */}
          <PuppyCarousel breedName={breed.name} />

          <TypographyH1 className="mb-3">{breed.name}</TypographyH1>
          <TypographyP className="mb-6">{breed.description}</TypographyP>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Scale className="w-5 h-5 mr-2" /> Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Male:</span>
                    <span className="font-medium">{breed.maleWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Female:</span>
                    <span className="font-medium">{breed.femaleWeight} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Ruler className="w-5 h-5 mr-2" /> Height
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Male:</span>
                    <span className="font-medium">{breed.maleHeight} inches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Female:</span>
                    <span className="font-medium">{breed.femaleHeight} inches</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full mb-8">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="temperament">Temperament</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <TypographyH3 className="mb-2">Coat Type & Colors</TypographyH3>
                  <TypographyP className="mb-2">This breed has a <strong>{breed.coat}</strong> coat.</TypographyP>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {breed.coatColors.map((color, index) => (
                      <Badge key={index} variant="secondary">{color}</Badge>
                    ))}
                  </div>
                </div>
                
                {breed.variants && breed.variants.length > 0 && (
                  <div>
                    <TypographyH3 className="mb-2">Variants</TypographyH3>
                    <ul className="list-disc pl-5 space-y-1">
                      {breed.variants.map((variant, index) => (
                        <li key={index}>{variant}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {breed.healthIssues && breed.healthIssues.length > 0 && (
                  <div>
                    <TypographyH3 className="mb-2 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                      Health Considerations
                    </TypographyH3>
                    <ul className="list-disc pl-5 space-y-1">
                      {breed.healthIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {breed.specialConsiderations && (
                  <div>
                    <TypographyH3 className="mb-2">Special Considerations</TypographyH3>
                    <TypographyP>{breed.specialConsiderations}</TypographyP>
                  </div>
                )}
                
                {breed.funFacts && breed.funFacts.length > 0 && (
                  <div>
                    <TypographyH3 className="mb-2">Fun Facts</TypographyH3>
                    <ul className="list-disc pl-5 space-y-1">
                      {breed.funFacts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="temperament">
              <div className="space-y-4">
                <TypographyH3 className="mb-2">Temperament Traits</TypographyH3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {breed.temperament.map((trait, index) => (
                    <Badge key={index} variant="secondary">{trait}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    {renderRatingBar(breed.energyLevel, "Energy Level", <Activity className="w-4 h-4" />)}
                    {renderRatingBar(breed.exerciseNeeds, "Exercise Needs", <PawPrint className="w-4 h-4" />)}
                    {renderRatingBar(breed.trainability, "Trainability", <Award className="w-4 h-4" />)}
                  </div>
                  <div>
                    {renderRatingBar(breed.goodWithChildren, "Good with Children", <Baby className="w-4 h-4" />)}
                    {renderRatingBar(breed.goodWithOtherDogs, "Good with Other Dogs", <Dog className="w-4 h-4" />)}
                    {renderRatingBar(breed.goodWithStrangers, "Good with Strangers", <Users className="w-4 h-4" />)}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <TypographyH3 className="mb-3">Origin & History</TypographyH3>
              <TypographyP className="mb-2">
                <strong>Origin:</strong> {breed.origin}
              </TypographyP>
              <TypographyP>{breed.history}</TypographyP>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Care Requirements</CardTitle>
              <CardDescription>What to expect when caring for a {breed.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderRatingBar(breed.sheddingAmount, "Shedding Amount", <BadgePlus className="w-4 h-4" />)}
              {renderRatingBar(breed.droolingAmount, "Drooling Amount", <Droplets className="w-4 h-4" />)}
              {renderRatingBar(breed.groomingNeeds, "Grooming Needs", <Scissors className="w-4 h-4" />)}
              {renderRatingBar(breed.barkingAmount, "Barking Level", <Volume2 className="w-4 h-4" />)}
            
              <Separator />
              
              <div>
                <TypographyH3 className="text-lg mb-3">Is this the right dog for you?</TypographyH3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <TypographyP className="text-sm">
                      Perfect for {breed.energyLevel >= 4 ? "active" : "relaxed"} owners who can provide 
                      {breed.exerciseNeeds >= 4 ? " plenty of exercise" : " moderate activity"}.
                    </TypographyP>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Thermometer className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <TypographyP className="text-sm">
                      {breed.goodWithChildren >= 4 
                        ? "Great family dog that gets along well with children."
                        : breed.goodWithChildren >= 3
                          ? "Can be good with children with proper socialization."
                          : "May not be ideal for families with young children."}
                    </TypographyP>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Scissors className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <TypographyP className="text-sm">
                      {breed.groomingNeeds >= 4
                        ? "Requires regular, thorough grooming."
                        : breed.groomingNeeds >= 3
                          ? "Needs moderate grooming attention."
                          : "Low-maintenance coat with minimal grooming needs."}
                    </TypographyP>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <Link href="/dog-breeds/compare">
                <Button variant="outline" className="w-full mb-2">Compare With Other Breeds</Button>
              </Link>
              <Link href="/listings">
                <Button className="w-full">See Available Puppies</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {breed.galleryImages && breed.galleryImages.length > 0 && (
        <div className="mb-8">
          <TypographyH2 className="mb-4">Photo Gallery</TypographyH2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {breed.galleryImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden h-40">
                <img 
                  src={image} 
                  alt={`${breed.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}