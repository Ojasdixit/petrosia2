import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const PetCareSection = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
            Pet Care Resources
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about caring for your new pet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Care Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <img
              src="https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
              alt="Puppy feeding guide"
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-2">
                Puppy Feeding Guide
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                Learn the best practices for feeding your new puppy including
                portion sizes, feeding schedules, and nutritional needs.
              </p>
              <Link
                href="/pet-care/feeding-guide"
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
              >
                Read Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Care Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
              alt="Puppy training basics"
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-2">
                Training Basics
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                Start off on the right paw with these essential training tips for
                puppies, from basic commands to potty training.
              </p>
              <Link
                href="/pet-care/training-basics"
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
              >
                Read Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Care Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <img
              src="https://essentialspetcare.com/wp-content/uploads/2021/03/Untitled-Project-32.jpg"
              alt="Pet healthcare essentials"
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-heading font-semibold text-neutral-900 mb-2">
                Healthcare Essentials
              </h3>
              <p className="text-neutral-600 text-sm mb-4">
                What every pet parent should know about vaccinations, regular
                check-ups, and recognizing common health issues.
              </p>
              <Link
                href="/pet-care/healthcare"
                className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
              >
                Read Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetCareSection;
