import { useEffect } from "react";
import MetaTags from "@/components/common/MetaTags";
import { Percent, Medal, ShieldCheck, Heart, Leaf, Dog, Cat, Rabbit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PremiumFoodProps = {
  id: number;
  brand: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  petType: string;
  badges: string[];
};

export default function ServicesPremiumFoodsPage() {
  // Redirect to petrosia.in when the user clicks on "Shop Now" or other CTA buttons
  const handleRedirect = () => {
    window.location.href = "https://petrosia.in";
  };
  
  // Premium pet food data
  const premiumFoods: PremiumFoodProps[] = [
    {
      id: 1,
      brand: "Royal Canin",
      description: "Breed-specific nutrition for optimal health",
      originalPrice: 4999,
      discountedPrice: 3999,
      image: "https://images.unsplash.com/photo-1585846888147-3620ff1d115c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "dog",
      badges: ["Grain-Free", "High Protein", "All Natural"]
    },
    {
      id: 2,
      brand: "Hills Science Diet",
      description: "Precisely balanced nutrition for specific life stages",
      originalPrice: 3599,
      discountedPrice: 2879,
      image: "https://images.unsplash.com/photo-1602584386319-fa8eb4361c2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "dog",
      badges: ["Vet Recommended", "Digestive Health", "Brain Development"]
    },
    {
      id: 3,
      brand: "Orijen",
      description: "Biologically appropriate food with fresh regional ingredients",
      originalPrice: 5499,
      discountedPrice: 4399,
      image: "https://images.unsplash.com/photo-1597843786411-a7fa8ad44ada?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "cat",
      badges: ["Free-Range", "Wild-Caught", "High Protein"]
    },
    {
      id: 4,
      brand: "Blue Buffalo",
      description: "Natural ingredients enhanced with vitamins and minerals",
      originalPrice: 3999,
      discountedPrice: 3199,
      image: "https://images.unsplash.com/photo-1542822255-2cc542c778d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "dog",
      badges: ["Grain-Free", "No By-Products", "Antioxidant Rich"]
    },
    {
      id: 5,
      brand: "Wellness CORE",
      description: "Protein-rich, grain-free natural nutrition",
      originalPrice: 4299,
      discountedPrice: 3439,
      image: "https://images.unsplash.com/photo-1616668010115-8f08071cd8c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "cat",
      badges: ["Indoor Formula", "Grain-Free", "Probiotics"]
    },
    {
      id: 6,
      brand: "Taste of the Wild",
      description: "High-quality protein from real meat, fish, and fowl",
      originalPrice: 3799,
      discountedPrice: 3039,
      image: "https://images.unsplash.com/photo-1589924691866-b54a54c3aac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "dog",
      badges: ["Novel Proteins", "Grain-Free", "Fruits & Vegetables"]
    },
    {
      id: 7,
      brand: "Acana",
      description: "Biologically appropriate diets that mirror your pet's natural diet",
      originalPrice: 4899,
      discountedPrice: 3919,
      image: "https://images.unsplash.com/photo-1590082871875-066d840bcb62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "cat",
      badges: ["Locally Sourced", "Free-Range", "High Protein"]
    },
    {
      id: 8,
      brand: "Oxbow",
      description: "Premium nutrition for small pets and exotics",
      originalPrice: 1999,
      discountedPrice: 1599,
      image: "https://images.unsplash.com/photo-1604542031658-5799ca5d7936?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
      petType: "small",
      badges: ["Timothy Hay", "Low-Calcium", "Fiber-Rich"]
    }
  ];

  return (
    <>
      <MetaTags
        title="20% Off Premium Pet Foods | Petrosia Pet Marketplace"
        description="Exclusive discounts on high-quality premium pet foods. Shop from top brands like Royal Canin, Hills Science Diet, Orijen, and more at Petrosia."
        keywords="premium pet food, pet food discount, dog food, cat food, Royal Canin, Hills Science Diet, Orijen, Blue Buffalo, pet nutrition, grain free pet food, high protein pet food"
        url="https://petrosia.in/services/premium-foods"
        image="https://petrosia.in/images/premium-pet-food-share.jpg"
      />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-yellow-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <div className="inline-block bg-white text-yellow-600 font-bold px-4 py-2 rounded-full mb-4 flex items-center">
                  <Percent className="h-5 w-5 mr-2" /> 20% OFF ALL PREMIUM PET FOODS
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Upgrade Your Pet's Nutrition Today</h1>
                <p className="text-xl text-yellow-100 mb-8">
                  Limited-time discount on the highest quality pet foods, scientifically formulated for optimal health.
                </p>
                <Button 
                  className="bg-white text-yellow-700 hover:bg-yellow-50 text-lg px-6 py-6 h-auto rounded-full"
                  onClick={handleRedirect}
                >
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Premium pet food" 
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Premium Pet Food</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-4">
                <Medal className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Superior Quality</h3>
              <p className="text-gray-600">
                Premium ingredients with higher nutritional value than regular pet food.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Healthier Pets</h3>
              <p className="text-gray-600">
                Improved digestion, coat quality, energy levels, and overall health.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Special Formulations</h3>
              <p className="text-gray-600">
                Specially designed for specific breeds, ages, and health conditions.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Many premium brands use sustainable and environmentally friendly practices.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Premium Foods</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Explore our selection of top-rated premium pet foods, all at 20% off for a limited time.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {premiumFoods.slice(0, 4).map((food) => (
              <div key={food.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={food.image} 
                    alt={food.brand} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 font-bold text-sm">
                    20% OFF
                  </div>
                  <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 py-1 px-2">
                    {food.petType === "dog" && <Dog className="h-5 w-5 text-yellow-600" />}
                    {food.petType === "cat" && <Cat className="h-5 w-5 text-yellow-600" />}
                    {food.petType === "small" && <Rabbit className="h-5 w-5 text-yellow-600" />}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900">{food.brand}</h3>
                  <p className="text-sm text-gray-600 mb-3">{food.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {food.badges.map((badge, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through text-sm">₹{food.originalPrice}</span>
                      <div className="font-bold text-lg text-yellow-700">₹{food.discountedPrice}</div>
                    </div>
                    <Button 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={handleRedirect}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-full"
              onClick={handleRedirect}
            >
              View All Premium Products
            </Button>
          </div>
        </div>
      </div>
      
      {/* Service Areas */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Available In</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Premium pet foods with 20% discount are available in these cities, with delivery options.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {["Delhi", "Mumbai", "Bangalore", "Kolkata", "Ahmedabad", "Pune", "Chennai"].map((city) => (
              <span 
                key={city} 
                className="text-sm bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="py-16 bg-yellow-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Limited Time Offer</h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on this special discount. Premium quality pet food at 20% off — your pet deserves the best!
          </p>
          <Button 
            className="bg-white text-yellow-700 hover:bg-yellow-50 text-lg px-8 py-6 h-auto rounded-full"
            onClick={handleRedirect}
          >
            Shop Premium Foods Now
          </Button>
        </div>
      </div>
    </>
  );
}