import { useState, useEffect } from 'react';
import { getAllCities, getCityByName } from "@/lib/city-data";

interface GeolocationResult {
  detectedCity: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to detect user's city based on geolocation
 * 
 * Uses the browser's Geolocation API to get coordinates
 * and then finds the nearest city from our city database
 */
export function useGeolocation(): GeolocationResult {
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the geolocation API is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    // Try to get user's location from stored value first
    const storedCity = localStorage.getItem('petrosia_detected_city');
    if (storedCity) {
      setDetectedCity(storedCity);
      setIsLoading(false);
      return;
    }

    // Get user's position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find the nearest city in our database
        const allCities = getAllCities();
        let nearestCity = null;
        let shortestDistance = Infinity;
        
        allCities.forEach(city => {
          // Calculate distance using Haversine formula
          const distance = calculateDistance(
            latitude, 
            longitude, 
            city.latitude,
            city.longitude
          );
          
          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestCity = city.name;
          }
        });
        
        // Set the detected city if we found one within 100km
        if (nearestCity && shortestDistance < 100) {
          setDetectedCity(nearestCity);
          // Store for future use
          localStorage.setItem('petrosia_detected_city', nearestCity);
        } else {
          // Default to Delhi if no city is close enough
          setDetectedCity('Delhi');
          localStorage.setItem('petrosia_detected_city', 'Delhi');
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location", error);
        setError("Unable to determine your location");
        setIsLoading(false);
        // Default to Delhi if we can't get location
        setDetectedCity('Delhi');
        localStorage.setItem('petrosia_detected_city', 'Delhi');
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 24 * 60 * 60 * 1000 // Cache for 24 hours
      }
    );
  }, []);

  return { detectedCity, isLoading, error };
}

/**
 * Calculate distance between two points using the Haversine formula
 * (great-circle distance between two points on a sphere)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}