import { useEffect } from "react";
import MetaTags from "@/components/common/MetaTags";
import { Truck, Clock, Shield, PackageCheck, MapPin, ArrowRight, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesDeliveryPage() {
  // Show delivery service details
  const handleViewDetails = () => {
    const detailsElement = document.getElementById("delivery-details");
    if (detailsElement) {
      if (detailsElement.classList.contains('hidden')) {
        detailsElement.classList.remove('hidden');
      } else {
        detailsElement.classList.add('hidden');
      }
    }
  };
  
  // WhatsApp contact for delivery services
  const handleWhatsAppContact = () => {
    const message = "Hi, I'm interested in your 24-hour pet product delivery service. Could you please provide more information about available products and delivery in my area?";
    window.open(`https://wa.me/9887805771?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <MetaTags
        title="24-Hour Pet Product Delivery | Petrosia Pet Marketplace"
        description="Get pet food, supplies, medications, and essentials delivered to your doorstep any time, day or night. Fast delivery within hours in Delhi, Mumbai, Bangalore, and other major cities."
        keywords="pet product delivery, 24-hour pet delivery, pet food delivery, pet supplies delivery, pet emergency delivery, pet medications delivery, pet essentials, same day pet delivery"
        url="https://petrosia.in/services/delivery"
        image="https://petrosia.in/images/pet-delivery-service.jpg"
      />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">24-Hour Pet Product Delivery</h1>
                <p className="text-xl text-blue-100 mb-8">
                  Get pet food, supplies, medications, and essentials delivered to your doorstep any time, day or night.
                </p>
                <Button 
                  className="bg-white text-blue-800 hover:bg-blue-50 text-lg px-6 py-6 h-auto rounded-full flex items-center"
                  onClick={handleViewDetails}
                >
                  <Eye className="h-6 w-6 mr-2" />
                  View Service Details <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Pet delivery service" 
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our 24-Hour Delivery Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Order anytime, day or night, and get your pet essentials when you need them most.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Receive your orders within hours in most service areas across major cities.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                All products are verified for quality, freshness, and authenticity.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                <PackageCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                From emergency pet food to medications and supplies, we have everything your pet needs.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Service Areas */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Service Areas</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            We currently offer 24-hour delivery services in these major cities, with more locations coming soon.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {["Delhi", "Mumbai", "Bangalore", "Kolkata", "Ahmedabad", "Pune", "Chennai"].map((city) => (
              <div key={city} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Service Details Section */}
      <div id="delivery-details" className="py-16 bg-white hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Delivery Service Listings</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-blue-700">Standard Delivery</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">2-4 Hours</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {["Pet food", "Treats", "Toys", "Basic supplies"].map((item, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm text-gray-500">
                  Starting from ₹99 delivery fee
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-blue-700">Express Delivery</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">1 Hour</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {["Pet food", "Medications", "Emergency supplies", "Premium items"].map((item, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm text-gray-500">
                  Starting from ₹199 delivery fee
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-blue-700">Scheduled Delivery</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Customizable</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {["Monthly pet food subscription", "Regular medication delivery", "Scheduled treats and toys", "Grooming products"].map((item, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-sm text-gray-500">
                  Starting from ₹79 delivery fee with subscription
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Contact Information</h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href="https://shop.petrosia.in/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order from Online Shop
                </a>
                
                <a 
                  href={`https://wa.me/9887805771?text=${encodeURIComponent("Hi, I'm interested in your 24-hour pet product delivery service. Could you please provide more information about available products and delivery in my area?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-700"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" 
                    alt="WhatsApp" 
                    className="w-4 h-4 mr-1" 
                  />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to experience convenient pet care?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our extensive selection of pet products and enjoy the convenience of 24-hour delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto rounded-full flex items-center justify-center"
              onClick={handleViewDetails}
            >
              <Eye className="h-6 w-6 mr-2" />
              View Service Details
            </Button>
            
            <a 
              href="https://shop.petrosia.in/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 h-auto rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Visit Online Shop
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}