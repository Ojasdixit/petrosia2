import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    pets: boolean;
    services: boolean;
    dogBreeds: boolean;
  }>({
    pets: true,
    services: false,
    dogBreeds: false
  });
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSection = (section: 'pets' | 'services' | 'dogBreeds') => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 512 512"
                style={{ transform: 'rotate(45deg)' }}
                fill="#ff6b00"
              >
                <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
              </svg>
              <span className="ml-2 text-xl font-heading font-bold text-neutral-900">
                Petrosia
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-neutral-600 hover:text-primary font-medium ${
                location === "/" ? "text-primary" : ""
              }`}
            >
              Home
            </Link>
            <div className="group relative inline-block">
              <button className={`text-neutral-600 hover:text-primary font-medium flex items-center ${
                location === "/listings" || location.startsWith("/pets/") ? "text-primary" : ""
              }`}>
                Pets <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 z-10 hidden group-hover:block w-48 bg-white shadow-lg rounded-md py-2">
                <Link href="/listings" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  All Pets
                </Link>
                <Link href="/pets/dogs" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Dogs
                </Link>
                <Link href="/pets/cats" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Cats
                </Link>
                <Link href="/pets/birds" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Birds
                </Link>
                <Link href="/pets/fish" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Fish
                </Link>
              </div>
            </div>
{/* Adoption link removed as requested */}
            <div className="group relative inline-block">
              <button className={`text-neutral-600 hover:text-primary font-medium flex items-center ${
                location.startsWith("/services") ? "text-primary" : ""
              }`}>
                Services <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 z-10 hidden group-hover:block w-56 bg-white shadow-lg rounded-md py-2">
                <Link href="/services" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  All Services
                </Link>
                <Link href="/services/vets" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Veterinary Services
                </Link>
                <Link href="/services/walkers" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Pet Walkers
                </Link>
                <Link href="/services/grooming" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Pet Grooming
                </Link>
                <Link href="/services/daycare" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Pet Daycare
                </Link>
                <Link href="/services/boarding" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Pet Boarding
                </Link>
                <Link href="/services/providers" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Service Providers
                </Link>
              </div>
            </div>
            <Link 
              href="/news" 
              className={`text-neutral-600 hover:text-primary font-medium ${
                location === "/news" ? "text-primary" : ""
              }`}
            >
              News
            </Link>
            <Link 
              href="/blog" 
              className={`text-neutral-600 hover:text-primary font-medium ${
                location.startsWith("/blog") ? "text-primary" : ""
              }`}
            >
              Blog
            </Link>
            <div className="group relative inline-block">
              <button className={`text-neutral-600 hover:text-primary font-medium flex items-center ${
                location === "/dog-breeds" || location.startsWith("/dog-breed") ? "text-primary" : ""
              }`}>
                Dog Breeds <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 z-10 hidden group-hover:block w-48 bg-white shadow-lg rounded-md py-2">
                <Link href="/dog-breeds" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  All Breeds
                </Link>
                <Link href="/dog-breeds/compare" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Compare Breeds
                </Link>
                <Link href="/dog-breeds/size/small" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Small Breeds
                </Link>
                <Link href="/dog-breeds/size/medium" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Medium Breeds
                </Link>
                <Link href="/dog-breeds/size/large" className="block px-4 py-2 text-neutral-600 hover:text-primary hover:bg-gray-50">
                  Large Breeds
                </Link>
              </div>
            </div>
            <Link 
              href="/franchise" 
              className={`text-neutral-600 hover:text-primary font-medium ${
                location === "/franchise" ? "text-primary" : ""
              }`}
            >
              Franchise
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User size={16} />
                    {user.firstName}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "seller" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/add-listing">Add Listing</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "buyer" && (
                    <DropdownMenuItem asChild>
                      <Link href="/listings">My Favorites</Link>
                    </DropdownMenuItem>
                  )}
                  {/* Profile route temporary redirects to home until implemented */}
                  <DropdownMenuItem asChild>
                    <Link href="/">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth?mode=login" className="hidden sm:block text-neutral-700 hover:text-primary font-medium">
                  Login
                </Link>
                <Link href="/auth?mode=signup" className="hidden sm:block">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-medium">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <button
              className="md:hidden text-neutral-700"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className={`block text-neutral-600 hover:text-primary font-medium ${
                location === "/" ? "text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {/* Pets Menu (Mobile) */}
            <button 
              className="flex justify-between items-center w-full text-neutral-600 font-medium mb-1"
              onClick={() => toggleSection('pets')}
            >
              <span>Pets</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.pets ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.pets && (
              <div className="pl-4 space-y-2 mb-2">
                <Link 
                  href="/listings" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/listings" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Pets
                </Link>
                <Link 
                  href="/pets/dogs" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/pets/dogs" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">🐕</span> Dogs
                </Link>
                <Link 
                  href="/pets/cats" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/pets/cats" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">🐈</span> Cats
                </Link>
                <Link 
                  href="/pets/birds" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/pets/birds" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">🦜</span> Birds
                </Link>
                <Link 
                  href="/pets/fish" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/pets/fish" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">🐠</span> Fish
                </Link>
              </div>
            )}
{/* Adoption link removed from mobile menu as requested */}
            {/* Services Menu (Mobile) */}
            <button 
              className="flex justify-between items-center w-full text-neutral-600 font-medium mb-1"
              onClick={() => toggleSection('services')}
            >
              <span>Services</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.services ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.services && (
              <div className="pl-4 space-y-2 mb-2">
                <Link 
                  href="/services" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Services
                </Link>
                <Link 
                  href="/services/vets" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/vets" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Veterinary Services
                </Link>
                <Link 
                  href="/services/walkers" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/walkers" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pet Walkers
                </Link>
                <Link 
                  href="/services/grooming" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/grooming" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pet Grooming
                </Link>
                <Link 
                  href="/services/daycare" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/daycare" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pet Daycare
                </Link>
                <Link 
                  href="/services/boarding" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/boarding" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pet Boarding
                </Link>
                <Link 
                  href="/services/providers" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/services/providers" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Service Providers
                </Link>
              </div>
            )}
            <Link 
              href="/news" 
              className={`block text-neutral-600 hover:text-primary font-medium ${
                location === "/news" ? "text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            <Link 
              href="/blog" 
              className={`block text-neutral-600 hover:text-primary font-medium ${
                location.startsWith("/blog") ? "text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            {/* Dog Breeds Menu (Mobile) */}
            <button 
              className="flex justify-between items-center w-full text-neutral-600 font-medium mb-1"
              onClick={() => toggleSection('dogBreeds')}
            >
              <span>Dog Breeds</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.dogBreeds ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.dogBreeds && (
              <div className="pl-4 space-y-2 mb-2">
                <Link 
                  href="/dog-breeds" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/dog-breeds" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Breeds
                </Link>
                <Link 
                  href="/dog-breeds/compare" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/dog-breeds/compare" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Compare Breeds
                </Link>
                <Link 
                  href="/dog-breeds/size/small" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/dog-breeds/size/small" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Small Breeds
                </Link>
                <Link 
                  href="/dog-breeds/size/medium" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/dog-breeds/size/medium" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Medium Breeds
                </Link>
                <Link 
                  href="/dog-breeds/size/large" 
                  className={`block text-neutral-600 hover:text-primary font-medium ${
                    location === "/dog-breeds/size/large" ? "text-primary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Large Breeds
                </Link>
              </div>
            )}
            <Link 
              href="/franchise" 
              className={`block text-neutral-600 hover:text-primary font-medium ${
                location === "/franchise" ? "text-primary" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Franchise
            </Link>
            
            {user ? (
              <>
                {user.role === "seller" && (
                  <>
                    <Link 
                      href="/seller/dashboard" 
                      className="block text-neutral-600 hover:text-primary font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                    <Link 
                      href="/seller/add-listing" 
                      className="block text-neutral-600 hover:text-primary font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Add Listing
                    </Link>
                  </>
                )}
                {user.role === "admin" && (
                  <Link 
                    href="/admin/dashboard" 
                    className="block text-neutral-600 hover:text-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-neutral-600 hover:text-primary font-medium w-full text-left"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-neutral-200 flex space-x-4">
                <Link 
                  href="/auth?mode=login" 
                  className="text-neutral-700 hover:text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/auth?mode=signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button size="sm" className="bg-primary hover:bg-primary-dark text-white font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
