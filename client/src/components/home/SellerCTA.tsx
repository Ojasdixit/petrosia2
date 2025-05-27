import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const SellerCTA = () => {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
              Are You a Breeder or Pet Seller?
            </h2>
            <p className="mt-3 text-white/90">
              Join our platform to reach thousands of potential pet owners across
              India.
            </p>
          </div>
          <Link href="/auth?mode=signup&role=seller">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-neutral-100 font-medium whitespace-nowrap"
            >
              List Your Pets Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellerCTA;
