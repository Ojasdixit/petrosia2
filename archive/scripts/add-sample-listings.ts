import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Setup neon with websockets
neonConfig.webSocketConstructor = ws;

// Sample data for pet listings
const samplePetListings = [
  {
    title: "Adorable Golden Retriever Puppies",
    breed: "Golden Retriever",
    age: 2,
    location: "Mumbai, Maharashtra",
    price: 25000,
    description: "Beautiful Golden Retriever puppies available for loving homes. They are well-socialized, playful, and come from a champion bloodline. Vaccinated and dewormed.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596797882948-7d01222e6224?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "dog"
  },
  {
    title: "Playful Labrador Puppies",
    breed: "Labrador Retriever",
    age: 3,
    location: "Delhi, Delhi",
    price: 20000,
    description: "Healthy and playful Labrador puppies looking for loving families. They are very friendly, good with children, and make excellent family pets. All vaccinations up to date.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1579556095429-a0e0ac538be4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591160690555-5debfba289f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "dog"
  },
  {
    title: "Majestic German Shepherd Puppies",
    breed: "German Shepherd",
    age: 2,
    location: "Bangalore, Karnataka",
    price: 30000,
    description: "Purebred German Shepherd puppies from champion bloodlines. Intelligent, loyal, and protective. These puppies are socialized early and will make excellent family protectors.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519138130-85e2e8b45da3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "dog"
  },
  {
    title: "Cute Beagle Puppies",
    breed: "Beagle",
    age: 2,
    location: "Hyderabad, Telangana",
    price: 18000,
    description: "Adorable Beagle puppies that are energetic, curious, and loving. They are great with children and make wonderful family companions. Dewormed and vaccinated.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598875384013-83c027b0317d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585559700398-1385b3a8aeb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "dog"
  },
  {
    title: "Playful Persian Kittens",
    breed: "Persian",
    age: 3,
    location: "Chennai, Tamil Nadu",
    price: 15000,
    description: "Beautiful Persian kittens with soft, luxurious coats and sweet temperaments. These kittens are litter trained and socialized with children and other pets.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "cat"
  },
  {
    title: "Maine Coon Kittens",
    breed: "Maine Coon",
    age: 2,
    location: "Pune, Maharashtra",
    price: 22000,
    description: "Magnificent Maine Coon kittens known for their friendly and intelligent nature. These gentle giants are perfect for families looking for an affectionate and playful companion.",
    isVaccinated: true,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ]),
    sellerId: 2,
    approved: true,
    petType: "cat"
  }
];

async function addSampleListings() {
  // DATABASE_URL is already set in the environment
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log("Starting to add sample pet listings...");
    
    // First check if we already have listings
    const checkResult = await pool.query('SELECT COUNT(*) FROM pet_listings');
    const count = parseInt(checkResult.rows[0].count);
    
    if (count > 0) {
      console.log(`Database already has ${count} pet listings. Skipping sample data insertion.`);
      return;
    }
    
    // Insert each sample listing
    for (const listing of samplePetListings) {
      const result = await pool.query(
        `INSERT INTO pet_listings (
          title, breed, age, location, price, description, 
          is_vaccinated, images, seller_id, approved, pet_type, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING id`,
        [
          listing.title,
          listing.breed,
          listing.age,
          listing.location,
          listing.price,
          listing.description,
          listing.isVaccinated,
          listing.images,
          listing.sellerId,
          listing.approved,
          listing.petType
        ]
      );
      
      console.log(`Added listing: ${listing.title} with ID: ${result.rows[0].id}`);
    }
    
    console.log("Successfully added all sample pet listings!");
  } catch (err) {
    console.error('Error adding sample pet listings:', err);
  } finally {
    await pool.end();
  }
}

addSampleListings();