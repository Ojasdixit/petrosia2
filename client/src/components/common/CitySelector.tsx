import React, { useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getAllCities, getCityByName } from '@/lib/city-data';
import SeoTags from './SeoTags';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  pagePath: string; // Current page path for SEO canonical URL
  pageTitle: string; // Base title without city
  pageDescription: string; // Base description without city
  pageKeywords?: string; // Base keywords without city
  serviceName?: string; // For service-specific pages
  schemaType?: 'LocalBusiness' | 'Service' | 'Product' | 'Article' | 'BlogPosting' | 'WebPage';
  servicePriceRange?: string;
  serviceDescription?: string;
}

/**
 * Enhanced CitySelector component with SEO optimizations
 * Automatically updates metadata and schema based on selected city
 */
const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange,
  pagePath,
  pageTitle,
  pageDescription,
  pageKeywords = '',
  serviceName = '',
  schemaType = 'Service',
  servicePriceRange,
  serviceDescription
}) => {
  const cities = getAllCities().map(city => city.name);
  const cityData = selectedCity !== 'all' ? getCityByName(selectedCity) : undefined;
  const isValidCity = selectedCity !== 'all' && cityData;
  
  // Construct SEO-optimized metadata based on selected city
  const title = isValidCity 
    ? `${pageTitle} in ${selectedCity}` 
    : pageTitle;
    
  const description = isValidCity
    ? `${pageDescription} Available in ${selectedCity} and other major cities across India. Book now!`
    : pageDescription;
    
  const baseUrl = 'https://petrosia.in';
  const url = isValidCity 
    ? `${baseUrl}${pagePath}?city=${selectedCity.toLowerCase()}`
    : `${baseUrl}${pagePath}`;
    
  return (
    <>
      {/* Dynamic SEO Tags that update when city changes */}
      {isValidCity && (
        <SeoTags
          title={title}
          description={description}
          keywords={pageKeywords}
          url={url}
          city={selectedCity}
          schemaType={schemaType}
          serviceName={serviceName || pageTitle}
          serviceDescription={serviceDescription || pageDescription}
          servicePriceRange={servicePriceRange}
        />
      )}
    
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CitySelector;