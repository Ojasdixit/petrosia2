import { db } from './server/db';
import { serviceProviders } from './shared/schema';

async function addServiceProviders() {
  try {
    console.log('Adding service providers to database...');
    
    // Daycare & Boarding Providers
    const daycareProviders = [
      {
        name: "Pawsome Pet Resort",
        serviceType: "daycare",
        location: "Delhi",
        address: "123 Pet Care Lane, New Delhi",
        phone: "9876543210",
        email: "info@pawsomepetresort.com",
        description: "Luxury pet daycare with indoor and outdoor play areas, swimming pools, and trained staff to care for your fur babies.",
        imageUrl: "/uploads/services/daycare-1.jpg",
        availableOptions: ["ac", "non-ac"],
        pricePerDay: 2500,
        isAC: true,
        isVerified: true,
        isActive: true
      },
      {
        name: "Happy Tails Boarding",
        serviceType: "boarding",
        location: "Mumbai",
        address: "45 Boarding Avenue, Mumbai",
        phone: "9876543211",
        email: "reservations@happytails.com",
        description: "24/7 care for your pets with comfortable kennels, regular exercise, and personalized attention.",
        imageUrl: "/uploads/services/boarding-1.jpg",
        availableOptions: ["ac", "non-ac"],
        pricePerDay: 2500,
        isAC: true,
        isVerified: true,
        isActive: true
      },
      {
        name: "Pet Paradise",
        serviceType: "daycare",
        location: "Bangalore",
        address: "78 Play Street, Bangalore",
        phone: "9876543212",
        email: "care@petparadise.in",
        description: "Spacious daycare facility with trained staff, scheduled activities, and constant supervision.",
        imageUrl: "/uploads/services/daycare-2.jpg",
        availableOptions: ["ac", "non-ac"],
        pricePerDay: 1800,
        isAC: false,
        isVerified: true,
        isActive: true
      },
      {
        name: "Furry Friends Lodge",
        serviceType: "boarding",
        location: "Chennai",
        address: "34 Animal Blvd, Chennai",
        phone: "9876543213",
        email: "stay@furryfriends.com",
        description: "Overnight pet boarding with cozy accommodations, daily walks, and premium food options.",
        imageUrl: "/uploads/services/boarding-2.jpg",
        availableOptions: ["ac", "non-ac"],
        pricePerDay: 1800,
        isAC: false,
        isVerified: true,
        isActive: true
      }
    ];

    // Veterinary Service Providers
    const vetProviders = [
      {
        name: "Healing Paws Clinic",
        serviceType: "vet",
        location: "Delhi",
        address: "56 Health Avenue, New Delhi",
        phone: "9876543214",
        email: "appointments@healingpaws.in",
        description: "Full-service veterinary clinic offering preventive care, diagnostics, surgery, and emergency services.",
        imageUrl: "/uploads/services/vet-1.jpg",
        pricePerVisit: 500,
        isVerified: true,
        isActive: true
      },
      {
        name: "Pet Care Hospital",
        serviceType: "vet",
        location: "Mumbai",
        address: "89 Vet Street, Mumbai",
        phone: "9876543215",
        email: "care@petcarehospital.com",
        description: "24/7 emergency veterinary care with state-of-the-art equipment and experienced doctors.",
        imageUrl: "/uploads/services/vet-2.jpg",
        pricePerVisit: 500,
        isVerified: true,
        isActive: true
      },
      {
        name: "Animal Wellness Center",
        serviceType: "vet",
        location: "Bangalore",
        address: "12 Health Park, Bangalore",
        phone: "9876543216",
        email: "wellness@animalcenter.in",
        description: "Comprehensive veterinary services including vaccinations, dental care, and nutrition counseling.",
        imageUrl: "/uploads/services/vet-3.jpg",
        pricePerVisit: 500,
        isVerified: true,
        isActive: true
      }
    ];

    // Dog Walker Providers
    const walkerProviders = [
      {
        name: "Leash & Go",
        serviceType: "walker",
        location: "Delhi",
        address: "23 Walker Lane, New Delhi",
        phone: "9876543217",
        email: "walk@leashandgo.com",
        description: "Professional dog walking services with GPS tracking, photos, and detailed reports after each walk.",
        imageUrl: "/uploads/services/walker-1.jpg",
        availableOptions: ["once-daily", "twice-daily"],
        pricePerMonth: 3000,
        isVerified: true,
        isActive: true
      },
      {
        name: "Paws on the Move",
        serviceType: "walker",
        location: "Mumbai",
        address: "67 Walk Street, Mumbai",
        phone: "9876543218",
        email: "schedule@pawsonthemove.in",
        description: "Scheduled dog walks with experienced walkers who provide exercise, socialization, and potty breaks.",
        imageUrl: "/uploads/services/walker-2.jpg",
        availableOptions: ["once-daily", "twice-daily"],
        pricePerMonth: 5000,
        isVerified: true,
        isActive: true
      },
      {
        name: "Happy Walks",
        serviceType: "walker",
        location: "Bangalore",
        address: "90 Trail Road, Bangalore",
        phone: "9876543219",
        email: "info@happywalks.com",
        description: "Individual and group dog walking with flexible scheduling and personalized care.",
        imageUrl: "/uploads/services/walker-3.jpg",
        availableOptions: ["once-daily", "twice-daily"],
        pricePerMonth: 3000,
        isVerified: true,
        isActive: true
      }
    ];

    // Dog Trainer Providers
    const trainerProviders = [
      {
        name: "Obedient Paws Training",
        serviceType: "trainer",
        location: "Delhi",
        address: "45 Training Ave, New Delhi",
        phone: "9876543220",
        email: "train@obedientpaws.in",
        description: "Expert dog training for basic obedience, behavior correction, and specialized skills.",
        imageUrl: "/uploads/services/trainer-1.jpg",
        pricePerVisit: 1500,
        isVerified: true,
        isActive: true
      },
      {
        name: "K9 Excellence",
        serviceType: "trainer",
        location: "Mumbai",
        address: "32 Command Street, Mumbai",
        phone: "9876543221",
        email: "training@k9excellence.com",
        description: "Professional dog training using positive reinforcement methods for puppies and adult dogs.",
        imageUrl: "/uploads/services/trainer-2.jpg",
        pricePerVisit: 2000,
        isVerified: true,
        isActive: true
      },
      {
        name: "Master Trainer Academy",
        serviceType: "trainer",
        location: "Bangalore",
        address: "78 Behavior Lane, Bangalore",
        phone: "9876543222",
        email: "info@mastertrainer.in",
        description: "Comprehensive dog training programs including obedience, agility, and behavior modification.",
        imageUrl: "/uploads/services/trainer-3.jpg",
        pricePerVisit: 2500,
        isVerified: true,
        isActive: true
      }
    ];

    // Combine all providers
    const allProviders = [
      ...daycareProviders,
      ...vetProviders,
      ...walkerProviders,
      ...trainerProviders
    ];

    // Insert providers into database
    for (const provider of allProviders) {
      // Check if provider already exists using `eq` from drizzle-orm
      import { eq, and } from 'drizzle-orm';
      
      const existingProviders = await db
        .select()
        .from(serviceProviders)
        .where(
          and(
            eq(serviceProviders.name, provider.name),
            eq(serviceProviders.location, provider.location)
          )
        );

      if (existingProviders.length === 0) {
        // Provider doesn't exist, insert it
        await db.insert(serviceProviders).values(provider);
        console.log(`Added service provider: ${provider.name} (${provider.serviceType}) in ${provider.location}`);
      } else {
        console.log(`Provider already exists: ${provider.name} (${provider.serviceType}) in ${provider.location}`);
      }
    }

    console.log('Service providers added successfully!');
  } catch (error) {
    console.error('Error adding service providers:', error);
  }
}

addServiceProviders().catch(console.error);