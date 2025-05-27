import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Home,
  Filter,
  Wind,
  Stethoscope,
  Dog,
  Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { WhatsappButton } from "@/components/common/WhatsappButton";
import { Link } from "wouter";

interface ServiceProvider {
  id: number;
  name: string;
  serviceType: "daycare" | "boarding" | "vet" | "walker" | "trainer";
  location: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  imageUrl?: string;
  pricePerDay?: number;
  pricePerMonth?: number;
  pricePerVisit?: number;
  availableOptions?: string[];
  isAC?: boolean;
  isVerified: boolean;
  isActive: boolean;
}

interface ServiceProviderListProps {
  serviceType?: string;
  hideFilters?: boolean;
}

export function ServiceProviderList({ serviceType = "", hideFilters = false }: ServiceProviderListProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>(serviceType || "all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  
  // Get service providers from API - using query string params instead of object
  const { data: providers = [], isLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/service-providers"],
    enabled: true,
  });
  
  useEffect(() => {
    // Apply filters
    let filtered = [...providers];
    
    // Filter by selected type if provided and not 'all'
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(
        (provider) => provider.serviceType === selectedType
      );
    }
    
    // Filter by selected location if provided and not 'all'
    if (selectedLocation && selectedLocation !== 'all') {
      filtered = filtered.filter(
        (provider) => provider.location === selectedLocation
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, selectedType, selectedLocation]);
  
  // Handle booking service
  const handleBookNow = (provider: ServiceProvider) => {
    // Get appropriate pricing based on service type
    let servicePrice = 0;
    let serviceName = "";
    
    switch (provider.serviceType) {
      case "daycare":
        servicePrice = provider.pricePerDay || 0;
        serviceName = "Pet Daycare";
        break;
      case "boarding":
        servicePrice = provider.pricePerDay || 0;
        serviceName = "Pet Boarding";
        break;
      case "vet":
        servicePrice = provider.pricePerVisit || 0;
        serviceName = "Veterinary Visit";
        break;
      case "walker":
        servicePrice = provider.pricePerMonth || 0;
        serviceName = "Dog Walking";
        break;
      case "trainer":
        servicePrice = provider.pricePerVisit || 0;
        serviceName = "Dog Training";
        break;
    }
    
    // Forward to WhatsApp for now as requested
    const message = `Hi! I'm interested in booking ${serviceName} services at ${provider.name} in ${provider.location}. Please provide more details.`;
    const whatsappNumber = "9887805771";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  
  // Get unique locations from providers for filter
  const locationOptions = providers.length > 0
    ? [...new Set(providers.map((provider: ServiceProvider) => provider.location))]
    : [];
  
  // Format price based on service type
  const formatPrice = (provider: ServiceProvider) => {
    switch (provider.serviceType) {
      case "daycare":
      case "boarding":
        return provider.pricePerDay 
          ? `₹${provider.pricePerDay}/day${provider.isAC ? ' (AC)' : ' (Non-AC)'}`
          : "Price on request";
      case "vet":
        return provider.pricePerVisit 
          ? `₹${provider.pricePerVisit}/visit`
          : "Price on request";
      case "walker":
        return provider.pricePerMonth 
          ? `₹${provider.pricePerMonth}/month`
          : "Price on request";
      case "trainer":
        return provider.pricePerVisit 
          ? `₹${provider.pricePerVisit}/session`
          : "Price on request";
      default:
        return "Price on request";
    }
  };
  
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "daycare":
        return <Home className="h-5 w-5 mr-1" />;
      case "boarding":
        return <Home className="h-5 w-5 mr-1" />;
      case "vet":
        return <Stethoscope className="h-5 w-5 mr-1" />;
      case "walker":
        return <Dog className="h-5 w-5 mr-1" />;
      case "trainer":
        return <Brain className="h-5 w-5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {!hideFilters && (
        <div className="mb-6 p-4 bg-accent/30 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">
                Service Type
              </label>
              <Select
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All service types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All service types</SelectItem>
                  <SelectItem value="daycare">Pet Daycare</SelectItem>
                  <SelectItem value="boarding">Pet Boarding</SelectItem>
                  <SelectItem value="vet">Veterinary Care</SelectItem>
                  <SelectItem value="walker">Dog Walking</SelectItem>
                  <SelectItem value="trainer">Dog Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-1 block">
                Location
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locationOptions.map((location: string) => (
                    <SelectItem key={location} value={location || "Unknown Location"}>
                      {location || "Unknown Location"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3 flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading service providers...
          </span>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No service providers found for the selected filters. Try changing your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider: ServiceProvider) => (
            <ProviderCard 
              key={provider.id} 
              provider={provider} 
              onBookNow={handleBookNow} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProviderCard({ provider, onBookNow }: { provider: ServiceProvider; onBookNow: (provider: ServiceProvider) => void }) {
  // Format service type name
  const serviceTypeNames = {
    daycare: "Pet Daycare",
    boarding: "Pet Boarding",
    vet: "Veterinary Care",
    walker: "Dog Walking",
    trainer: "Dog Training"
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              {provider.location}
            </CardDescription>
          </div>
          {provider.isVerified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">
            {serviceTypeNames[provider.serviceType as keyof typeof serviceTypeNames]}
          </Badge>
          {provider.isAC && provider.serviceType === "daycare" && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Wind className="h-3 w-3 mr-1" />
              AC Available
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {provider.description}
        </p>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{provider.phone}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="truncate">{provider.email}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-3">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-lg">
            {formatPrice(provider)}
          </div>
          <WhatsappButton
            number="9887805771" 
            message={`Hi! I'm interested in booking services at ${provider.name}. Please provide more details.`}
            className="w-full sm:w-auto"
          >
            Book Now
          </WhatsappButton>
        </div>
      </CardFooter>
    </Card>
  );
}

function formatPrice(provider: ServiceProvider) {
  switch (provider.serviceType) {
    case "daycare":
    case "boarding":
      return provider.pricePerDay 
        ? `₹${provider.pricePerDay}/day${provider.isAC ? ' (AC)' : ' (Non-AC)'}`
        : "Price on request";
    case "vet":
      return provider.pricePerVisit 
        ? `₹${provider.pricePerVisit}/visit`
        : "Price on request";
    case "walker":
      return provider.pricePerMonth 
        ? `₹${provider.pricePerMonth}/month`
        : "Price on request";
    case "trainer":
      return provider.pricePerVisit 
        ? `₹${provider.pricePerVisit}/session`
        : "Price on request";
    default:
      return "Price on request";
  }
}