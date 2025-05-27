import { Link } from "wouter";
import { 
  Search, 
  Store,
  Heart,
  Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UserRoleSelection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
            How Petrosia Works
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Join our community and experience a safe, transparent way to find or
            sell pets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buyer Card */}
          <div className="bg-neutral-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Search className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
              I'm a Buyer
            </h3>
            <p className="text-neutral-600 mb-6">
              Browse verified listings, connect with sellers, and find your
              perfect pet companion.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Access to verified pet listings
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Direct contact with sellers
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Health information assurance
                </span>
              </li>
            </ul>
            <Link href="/auth?mode=signup&role=buyer">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white font-medium">
                Sign Up as Buyer
              </Button>
            </Link>
          </div>

          {/* Seller Card */}
          <div className="bg-neutral-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Store className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
              I'm a Seller
            </h3>
            <p className="text-neutral-600 mb-6">
              List your puppies or pets for sale and connect with genuine buyers
              across India.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Create detailed pet listings
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Reach thousands of potential buyers
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Simple verification process
                </span>
              </li>
            </ul>
            <Link href="/auth?mode=signup&role=seller">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Sign Up as Seller
              </Button>
            </Link>
          </div>

          {/* Adoption Card */}
          <div className="bg-neutral-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <Heart className="text-neutral-700 text-xl" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-neutral-900 mb-2">
              Looking to Adopt?
            </h3>
            <p className="text-neutral-600 mb-6">
              Find pets for adoption from shelters and rescue centers across the
              country.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">Rescue a pet in need</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Adoption support and guidance
                </span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-600 mt-1 mr-2 h-4 w-4" />
                <span className="text-neutral-700">
                  Connect with local shelters
                </span>
              </li>
            </ul>
            <Link href="/adoption">
              <Button className="w-full bg-neutral-700 hover:bg-neutral-800 text-white font-medium">
                View Adoption Options
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRoleSelection;
