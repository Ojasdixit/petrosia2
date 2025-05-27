/**
 * City data for Petrosia services with coordinates for SEO purposes
 * Includes all major Indian cities with city-specific SEO tags
 */

export type City = {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  services: {
    petBoarding: boolean;
    dogTraining: boolean;
    petGrooming: boolean;
    vetVisits: boolean;
    petWalking: boolean;
    daycare: boolean;
  };
  population: number; // Approximate for SEO relevance
  seoTags?: string[]; // SEO tags specific to this city
};

export const CITIES: Record<string, City> = {
  "Delhi": {
    name: "Delhi",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 16787941,
    seoTags: [
      "buy puppy in Delhi",
      "pet shops in Delhi",
      "best dog breeders in Delhi",
      "pet adoption Delhi",
      "pet care services Delhi"
    ]
  },
  "Mumbai": {
    name: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0760,
    longitude: 72.8777,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 12442373,
    seoTags: [
      "buy puppy in Mumbai",
      "pet shops in Mumbai",
      "dog breeders in Mumbai",
      "pet adoption Mumbai",
      "pet care services Mumbai"
    ]
  },
  "Bangalore": {
    name: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 8443675,
    seoTags: [
      "buy puppy in Bangalore",
      "pet shops in Bangalore",
      "dog breeders in Bangalore",
      "pet adoption Bangalore",
      "pet care services Bangalore"
    ]
  },
  "Kolkata": {
    name: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 4496694,
    seoTags: [
      "buy puppy in Kolkata",
      "pet shops in Kolkata",
      "dog breeders in Kolkata",
      "pet adoption Kolkata",
      "pet care services Kolkata"
    ]
  },
  "Ahmedabad": {
    name: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 5570585,
    seoTags: [
      "buy puppy in Ahmedabad",
      "pet shops in Ahmedabad",
      "dog breeders in Ahmedabad",
      "pet adoption Ahmedabad",
      "pet care services Ahmedabad"
    ]
  },
  "Pune": {
    name: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 3124458,
    seoTags: [
      "buy puppy in Pune",
      "pet shops in Pune",
      "dog breeders in Pune",
      "pet adoption Pune",
      "pet care services Pune"
    ]
  },
  "Chennai": {
    name: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 4646732,
    seoTags: [
      "buy puppy in Chennai",
      "pet shops in Chennai",
      "dog breeders in Chennai",
      "pet adoption Chennai",
      "pet care services Chennai"
    ]
  },
  "Hyderabad": {
    name: "Hyderabad",
    state: "Telangana",
    latitude: 17.3850,
    longitude: 78.4867,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 6809970,
    seoTags: [
      "buy puppy in Hyderabad",
      "pet shops in Hyderabad",
      "dog breeders in Hyderabad",
      "pet adoption Hyderabad",
      "pet care services Hyderabad"
    ]
  },
  "Jaipur": {
    name: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 3046163,
    seoTags: [
      "buy puppy in Jaipur",
      "pet shops in Jaipur",
      "dog breeders in Jaipur",
      "pet adoption Jaipur",
      "pet care services Jaipur"
    ]
  },
  // Added all major cities from the provided list
  "Agra": {
    name: "Agra",
    state: "Uttar Pradesh",
    latitude: 27.1767,
    longitude: 78.0081,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1760285,
    seoTags: ["buy puppy in Agra", "pet shops in Agra", "dog breeders in Agra"]
  },
  "Ajmer": {
    name: "Ajmer",
    state: "Rajasthan",
    latitude: 26.4499,
    longitude: 74.6399,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 542321,
    seoTags: ["buy puppy in Ajmer", "pet shops in Ajmer", "dog breeders in Ajmer"]
  },
  "Aligarh": {
    name: "Aligarh",
    state: "Uttar Pradesh",
    latitude: 27.8974,
    longitude: 78.0880,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: false
    },
    population: 874408,
    seoTags: ["buy puppy in Aligarh", "pet shops in Aligarh", "dog breeders in Aligarh"]
  },
  "Allahabad": {
    name: "Allahabad",
    state: "Uttar Pradesh",
    latitude: 25.4358,
    longitude: 81.8463,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1117094,
    seoTags: ["buy puppy in Allahabad", "pet shops in Allahabad", "dog breeders in Allahabad"]
  },
  "Amritsar": {
    name: "Amritsar",
    state: "Punjab",
    latitude: 31.6340,
    longitude: 74.8723,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1132383,
    seoTags: ["buy puppy in Amritsar", "pet shops in Amritsar", "dog breeders in Amritsar"]
  },
  "Aurangabad": {
    name: "Aurangabad",
    state: "Maharashtra",
    latitude: 19.8762,
    longitude: 75.3433,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1175116,
    seoTags: ["buy puppy in Aurangabad", "pet shops in Aurangabad", "dog breeders in Aurangabad"]
  },
  "Bhopal": {
    name: "Bhopal",
    state: "Madhya Pradesh",
    latitude: 23.2599,
    longitude: 77.4126,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1798218,
    seoTags: ["buy puppy in Bhopal", "pet shops in Bhopal", "dog breeders in Bhopal"]
  },
  "Bikaner": {
    name: "Bikaner",
    state: "Rajasthan",
    latitude: 28.0229,
    longitude: 73.3119,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: false
    },
    population: 644406,
    seoTags: ["buy puppy in Bikaner", "pet shops in Bikaner", "dog breeders in Bikaner"]
  },
  "Coimbatore": {
    name: "Coimbatore",
    state: "Tamil Nadu",
    latitude: 11.0168,
    longitude: 76.9558,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1601438,
    seoTags: ["buy puppy in Coimbatore", "pet shops in Coimbatore", "dog breeders in Coimbatore"]
  },
  "Dehradun": {
    name: "Dehradun",
    state: "Uttarakhand",
    latitude: 30.3165,
    longitude: 78.0322,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 578420,
    seoTags: ["buy puppy in Dehradun", "pet shops in Dehradun", "dog breeders in Dehradun"]
  },
  "Faridabad": {
    name: "Faridabad",
    state: "Haryana",
    latitude: 28.4089,
    longitude: 77.3178,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1404653,
    seoTags: ["buy puppy in Faridabad", "pet shops in Faridabad", "dog breeders in Faridabad"]
  },
  "Ghaziabad": {
    name: "Ghaziabad",
    state: "Uttar Pradesh",
    latitude: 28.6692,
    longitude: 77.4538,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1648649,
    seoTags: ["buy puppy in Ghaziabad", "pet shops in Ghaziabad", "dog breeders in Ghaziabad"]
  },
  "Gwalior": {
    name: "Gwalior",
    state: "Madhya Pradesh",
    latitude: 26.2183,
    longitude: 78.1828,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1054420,
    seoTags: ["buy puppy in Gwalior", "pet shops in Gwalior", "dog breeders in Gwalior"]
  },
  "Indore": {
    name: "Indore",
    state: "Madhya Pradesh",
    latitude: 22.7196,
    longitude: 75.8577,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1994397,
    seoTags: ["buy puppy in Indore", "pet shops in Indore", "dog breeders in Indore"]
  },
  "Jabalpur": {
    name: "Jabalpur",
    state: "Madhya Pradesh",
    latitude: 23.1815,
    longitude: 79.9864,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1081677,
    seoTags: ["buy puppy in Jabalpur", "pet shops in Jabalpur", "dog breeders in Jabalpur"]
  },
  "Jamshedpur": {
    name: "Jamshedpur",
    state: "Jharkhand",
    latitude: 22.8046,
    longitude: 86.2029,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 629659,
    seoTags: ["buy puppy in Jamshedpur", "pet shops in Jamshedpur", "dog breeders in Jamshedpur"]
  },
  "Jodhpur": {
    name: "Jodhpur",
    state: "Rajasthan",
    latitude: 26.2389,
    longitude: 73.0243,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1033918,
    seoTags: ["buy puppy in Jodhpur", "pet shops in Jodhpur", "dog breeders in Jodhpur"]
  },
  "Kanpur": {
    name: "Kanpur",
    state: "Uttar Pradesh",
    latitude: 26.4499,
    longitude: 80.3319,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 2765348,
    seoTags: ["buy puppy in Kanpur", "pet shops in Kanpur", "dog breeders in Kanpur"]
  },
  "Kochi": {
    name: "Kochi",
    state: "Kerala",
    latitude: 9.9312,
    longitude: 76.2673,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 677381,
    seoTags: ["buy puppy in Kochi", "pet shops in Kochi", "dog breeders in Kochi"]
  },
  "Lucknow": {
    name: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8467,
    longitude: 80.9462,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 2817105,
    seoTags: ["buy puppy in Lucknow", "pet shops in Lucknow", "dog breeders in Lucknow"]
  },
  "Ludhiana": {
    name: "Ludhiana",
    state: "Punjab",
    latitude: 30.9010,
    longitude: 75.8573,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1618879,
    seoTags: ["buy puppy in Ludhiana", "pet shops in Ludhiana", "dog breeders in Ludhiana"]
  },
  "Madurai": {
    name: "Madurai",
    state: "Tamil Nadu",
    latitude: 9.9252,
    longitude: 78.1198,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1017865,
    seoTags: ["buy puppy in Madurai", "pet shops in Madurai", "dog breeders in Madurai"]
  },
  "Nagpur": {
    name: "Nagpur",
    state: "Maharashtra",
    latitude: 21.1458,
    longitude: 79.0882,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 2405421,
    seoTags: ["buy puppy in Nagpur", "pet shops in Nagpur", "dog breeders in Nagpur"]
  },
  "Nashik": {
    name: "Nashik",
    state: "Maharashtra",
    latitude: 20.0059,
    longitude: 73.7911,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1486053,
    seoTags: ["buy puppy in Nashik", "pet shops in Nashik", "dog breeders in Nashik"]
  },
  "Patna": {
    name: "Patna",
    state: "Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1683200,
    seoTags: ["buy puppy in Patna", "pet shops in Patna", "dog breeders in Patna"]
  },
  "Raipur": {
    name: "Raipur",
    state: "Chhattisgarh",
    latitude: 21.2514,
    longitude: 81.6296,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1010087,
    seoTags: ["buy puppy in Raipur", "pet shops in Raipur", "dog breeders in Raipur"]
  },
  "Rajkot": {
    name: "Rajkot",
    state: "Gujarat",
    latitude: 22.3039,
    longitude: 70.8022,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1286995,
    seoTags: ["buy puppy in Rajkot", "pet shops in Rajkot", "dog breeders in Rajkot"]
  },
  "Ranchi": {
    name: "Ranchi",
    state: "Jharkhand",
    latitude: 23.3441,
    longitude: 85.3096,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1073440,
    seoTags: ["buy puppy in Ranchi", "pet shops in Ranchi", "dog breeders in Ranchi"]
  },
  "Salem": {
    name: "Salem",
    state: "Tamil Nadu",
    latitude: 11.6643,
    longitude: 78.1460,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: false
    },
    population: 917414,
    seoTags: ["buy puppy in Salem", "pet shops in Salem", "dog breeders in Salem"]
  },
  "Shimla": {
    name: "Shimla",
    state: "Himachal Pradesh",
    latitude: 31.1048,
    longitude: 77.1734,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 171817,
    seoTags: ["buy puppy in Shimla", "pet shops in Shimla", "dog breeders in Shimla"]
  },
  "Srinagar": {
    name: "Srinagar",
    state: "Jammu & Kashmir",
    latitude: 34.0837,
    longitude: 74.7973,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: false
    },
    population: 1180570,
    seoTags: ["buy puppy in Srinagar", "pet shops in Srinagar", "dog breeders in Srinagar"]
  },
  "Surat": {
    name: "Surat",
    state: "Gujarat",
    latitude: 21.1702,
    longitude: 72.8311,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 4467797,
    seoTags: ["buy puppy in Surat", "pet shops in Surat", "dog breeders in Surat"]
  },
  "Thane": {
    name: "Thane",
    state: "Maharashtra",
    latitude: 19.2183,
    longitude: 72.9781,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1841488,
    seoTags: ["buy puppy in Thane", "pet shops in Thane", "dog breeders in Thane"]
  },
  "Thiruvananthapuram": {
    name: "Thiruvananthapuram",
    state: "Kerala",
    latitude: 8.5241,
    longitude: 76.9366,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 957730,
    seoTags: ["buy puppy in Thiruvananthapuram", "pet shops in Thiruvananthapuram", "dog breeders in Thiruvananthapuram"]
  },
  "Tiruchirappalli": {
    name: "Tiruchirappalli",
    state: "Tamil Nadu",
    latitude: 10.7905,
    longitude: 78.7047,
    services: {
      petBoarding: true,
      dogTraining: false,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 916674,
    seoTags: ["buy puppy in Tiruchirappalli", "pet shops in Tiruchirappalli", "dog breeders in Tiruchirappalli"]
  },
  "Udaipur": {
    name: "Udaipur",
    state: "Rajasthan",
    latitude: 24.5854,
    longitude: 73.7125,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 451100,
    seoTags: ["buy puppy in Udaipur", "pet shops in Udaipur", "dog breeders in Udaipur"]
  },
  "Vadodara": {
    name: "Vadodara",
    state: "Gujarat",
    latitude: 22.3072,
    longitude: 73.1812,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1670806,
    seoTags: ["buy puppy in Vadodara", "pet shops in Vadodara", "dog breeders in Vadodara"]
  },
  "Varanasi": {
    name: "Varanasi",
    state: "Uttar Pradesh",
    latitude: 25.3176,
    longitude: 82.9739,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: false,
      daycare: true
    },
    population: 1201815,
    seoTags: ["buy puppy in Varanasi", "pet shops in Varanasi", "dog breeders in Varanasi"]
  },
  "Visakhapatnam": {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    latitude: 17.6868,
    longitude: 83.2185,
    services: {
      petBoarding: true,
      dogTraining: true,
      petGrooming: true,
      vetVisits: true,
      petWalking: true,
      daycare: true
    },
    population: 1728128,
    seoTags: ["buy puppy in Visakhapatnam", "pet shops in Visakhapatnam", "dog breeders in Visakhapatnam"]
  }
};

/**
 * Returns all supported cities
 */
export function getAllCities(): City[] {
  return Object.values(CITIES);
}

/**
 * Returns cities that support a specific service
 */
export function getCitiesForService(service: keyof City['services']): City[] {
  return Object.values(CITIES).filter(city => city.services[service]);
}

/**
 * Returns city data by name
 */
export function getCityByName(cityName: string): City | undefined {
  return CITIES[cityName];
}

/**
 * Returns geo tags for a specific city
 */
export function getCityGeoTags(cityName: string): {
  region: string;
  placename: string;
  position: string;
  icbm: string;
} | undefined {
  const city = CITIES[cityName];
  if (!city) return undefined;
  
  return {
    region: "IN",
    placename: city.name,
    position: `${city.latitude};${city.longitude}`,
    icbm: `${city.latitude}, ${city.longitude}`
  };
}

/**
 * Returns city-specific SEO tags
 */
export function getCitySeoTags(cityName: string): string[] {
  const city = CITIES[cityName];
  return city?.seoTags || [];
}

/**
 * Default price ranges for different services (for schema markup)
 */
export const SERVICE_PRICE_RANGES = {
  petBoarding: "₹1,800 - ₹2,500",
  dogTraining: "₹1,500 - ₹2,500",
  petGrooming: "₹500 - ₹1,500",
  vetVisits: "₹500",
  petWalking: "₹3,000 - ₹5,000",
  daycare: "₹1,800 - ₹2,500",
};

/**
 * Service descriptive content for SEO (used in meta descriptions and schema)
 */
export const SERVICE_DESCRIPTIONS = {
  petBoarding: "Safe and comfortable pet boarding with 24/7 care, daily walks, and proper nutrition. Perfect for when you're away.",
  dogTraining: "Professional dog training services to address behavior issues, teach commands, and build the bond between you and your dog.",
  petGrooming: "Complete pet grooming services including bath, haircut, nail trimming, ear cleaning, and more for a healthy, happy pet.",
  vetVisits: "Convenient home vet visits for vaccinations, check-ups, minor treatments, and expert pet health advice.",
  petWalking: "Reliable pet walking services once or twice daily (Sunday off), ensuring your pet gets proper exercise and care.",
  daycare: "Safe pet daycare with playmates, exercise, and professional supervision, perfect for busy pet parents.",
};

/**
 * Primary and secondary keywords for different services (for SEO)
 */
export const SERVICE_KEYWORDS = {
  petBoarding: {
    primary: [
      "pet boarding",
      "dog boarding",
      "cat boarding",
      "pet hostel",
      "pet hotel"
    ],
    secondary: [
      "safe pet boarding",
      "luxury pet boarding",
      "pet sitting",
      "dog daycare",
      "pet care while on vacation"
    ]
  },
  dogTraining: {
    primary: [
      "dog training",
      "puppy training",
      "dog obedience training",
      "dog behavior training",
      "dog trainer"
    ],
    secondary: [
      "dog commands",
      "stop dog barking",
      "house train puppy",
      "aggressive dog training",
      "dog leash training"
    ]
  },
  petGrooming: {
    primary: [
      "pet grooming",
      "dog grooming",
      "cat grooming",
      "pet salon",
      "mobile pet grooming"
    ],
    secondary: [
      "dog bathing service",
      "dog haircut",
      "pet nail trimming",
      "pet spa",
      "de-shedding service"
    ]
  },
  vetVisits: {
    primary: [
      "home vet visit",
      "mobile veterinarian",
      "pet doctor home visit",
      "pet vaccination at home",
      "emergency vet"
    ],
    secondary: [
      "pet health checkup",
      "dog vaccination",
      "cat vaccination",
      "pet doctor near me",
      "vet consultation"
    ]
  },
  petWalking: {
    primary: [
      "pet walking service",
      "dog walker",
      "daily dog walking",
      "professional dog walking",
      "dog exercise service"
    ],
    secondary: [
      "dog walking near me",
      "weekly dog walking",
      "evening dog walk",
      "senior dog walking",
      "puppy walking service"
    ]
  },
  daycare: {
    primary: [
      "pet daycare",
      "dog daycare",
      "cat daycare",
      "pet day boarding",
      "animal daycare"
    ],
    secondary: [
      "pet daycare near me",
      "supervised pet play",
      "daily pet care",
      "doggy day camp",
      "pet socialization"
    ]
  }
};