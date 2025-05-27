import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const AdoptionSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
              Adopt a Pet in Need
            </h2>
            <p className="mt-4 text-neutral-600 max-w-md">
              Thousands of loving pets are waiting for their forever homes.
              Browse our adoption listings and give a pet a second chance.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <p className="ml-3 text-neutral-700">
                  Fully vaccinated and health-checked
                </p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <p className="ml-3 text-neutral-700">
                  Support from adoption counselors
                </p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <p className="ml-3 text-neutral-700">
                  Connect directly with shelters
                </p>
              </li>
            </ul>
            <Link href="/adoption">
              <Button
                className="mt-8 bg-neutral-800 hover:bg-neutral-900 text-white font-medium"
                size="lg"
              >
                Browse Adoption Pets <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1588269845464-8993565cac3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
              alt="Dog waiting for adoption"
              className="rounded-lg h-auto w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
              alt="Cat waiting for adoption"
              className="rounded-lg h-auto w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
              alt="Puppy waiting for adoption"
              className="rounded-lg h-auto w-full object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"
              alt="Kitten waiting for adoption"
              className="rounded-lg h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionSection;
