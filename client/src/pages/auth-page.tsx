import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import AuthForms from "@/components/auth/AuthForms";
import MetaTags from "@/components/common/MetaTags";

const AuthPage = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Handle redirect when user logs in
  useEffect(() => {
    if (user) {
      // If user is logged in, redirect them
      const returnPath = localStorage.getItem('returnAfterLogin');
      if (returnPath) {
        localStorage.removeItem('returnAfterLogin');
        // Use direct window location for more consistent navigation
        window.location.href = returnPath;
      } else {
        // Return to home if no saved path
        window.location.href = "/";
      }
    }
  }, [user]);

  return (
    <>
      <MetaTags 
        title="Login or Sign Up - Petrosia"
        description="Join Petrosia to find your perfect pet or connect with pet lovers across India. Create an account to access exclusive pet listings, service bookings, and community features."
        keywords="pet marketplace India, pet login, pet signup, pet registration, Petrosia account, pet adoption, pet community, pet services, secure login"
        url="https://petrosia.in/auth"
        image="https://petrosia.in/images/auth-page-share.jpg"
      />

      <div className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-lg">
            {/* Auth Form */}
            <div className="md:w-1/2 p-6 md:p-10">
              <AuthForms />
            </div>

            {/* Hero Section */}
            <div className="md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-6 md:p-10 text-white relative hidden md:block">
              <div className="absolute inset-0 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                  <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle id="pattern-circle" cx="10" cy="10" r="1.5" fill="#FFF"></circle>
                  </pattern>
                  <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-heading font-bold mb-6">
                  Welcome to Petrosia
                </h2>
                <p className="mb-6">
                  India's ultimate marketplace for finding and selling pet companions.
                </p>
                
                <div className="space-y-4 mt-10">
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Verified Breeders</h3>
                      <p className="text-white/80 text-sm">
                        All pet listings are from verified breeders and sellers
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Adoption Support</h3>
                      <p className="text-white/80 text-sm">
                        Connect with adoption centers to find rescue pets
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/20 p-2 rounded-full mr-4">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Safe Transactions</h3>
                      <p className="text-white/80 text-sm">
                        Connect directly with sellers with transparency and trust
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 right-10">
                <img 
                  src="https://images.unsplash.com/photo-1591946614720-90a587da4a36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80" 
                  alt="Cute puppy" 
                  className="rounded-full w-24 h-24 border-4 border-white/30 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
