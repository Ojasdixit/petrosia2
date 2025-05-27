import React from "react";
import { Calendar, Users, Target, Award, Map, Shield } from "lucide-react";

const AboutUsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Petrosia
            </h1>
            <p className="text-lg text-gray-700">
              India's trusted pet marketplace, connecting pet lovers with responsible breeders and adoption centers across the country.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-lg text-gray-700">
                From a simple idea to India's leading pet marketplace
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  A Vision Born From Passion
                </h3>
                <p className="text-gray-700 mb-4">
                  Petrosia began in 2020 when siblings Aryan and Anika Sharma, passionate pet lovers since childhood, recognized a critical gap in India's pet marketplace. With their family Golden Retriever, Max, as their inspiration, they envisioned a platform that would prioritize pet welfare while connecting responsible breeders with loving homes.
                </p>
                <p className="text-gray-700">
                  Starting from a small apartment in Mumbai with just a laptop and a dream, the siblings built the first version of Petrosia, focusing initially on dog adoptions in their local community. Their commitment to ethical practices and genuine care for animals quickly set them apart in the industry.
                </p>
              </div>
              <div className="bg-orange-100 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-orange-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Our Journey Timeline</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">1</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">2020</strong> - Founded by siblings Aryan and Anika Sharma in Mumbai
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">2</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">2021</strong> - Expanded to Delhi and Bangalore with 50+ registered breeders
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">3</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">2022</strong> - Launched mobile app and expanded to 10 major cities
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">4</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">2023</strong> - Added comprehensive pet services directory
                    </div>
                  </li>
                  <li className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">5</span>
                      </div>
                    </div>
                    <div>
                      <strong className="text-gray-900">2025</strong> - Present across 30+ cities with 1M+ monthly visitors
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mb-16">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                From Startup to Empire
              </h3>
              <p className="text-gray-700 mb-4">
                What began as a small startup has transformed into a nationwide empire connecting thousands of pet lovers with their perfect companions every month. After securing their first round of funding in 2021, Petrosia expanded its operations beyond Mumbai to Delhi and Bangalore, bringing their ethical marketplace model to new regions.
              </p>
              <p className="text-gray-700 mb-4">
                By 2022, the company had developed a proprietary verification system for breeders, setting new standards for the industry. Their mobile app launch the same year accelerated growth, allowing them to expand into 10 major cities across India.
              </p>
              <p className="text-gray-700 mb-4">
                Today, Petrosia operates in over 30 cities nationwide, with a growing team of 150+ employees who share the founders' passion for pets. The platform now facilitates over 5,000 successful pet adoptions monthly and has expanded to include a comprehensive directory of pet services, from veterinary care to grooming and training.
              </p>
              <p className="text-gray-700">
                Despite their tremendous growth, Aryan and Anika remain hands-on in the business, ensuring that Petrosia's core mission of ethical pet commerce remains at the heart of everything they do.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-amber-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-amber-600 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-900">Leadership Team</h4>
                </div>
                <ul className="space-y-4">
                  <li>
                    <strong className="text-gray-900 block">Aryan Sharma</strong>
                    <span className="text-gray-600 text-sm">Co-Founder & CEO</span>
                    <p className="text-gray-700 mt-1 text-sm">
                      Oversees company strategy and operations. Passionate advocate for ethical pet breeding practices.
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 block">Anika Sharma</strong>
                    <span className="text-gray-600 text-sm">Co-Founder & COO</span>
                    <p className="text-gray-700 mt-1 text-sm">
                      Leads product development and customer experience. Former veterinary assistant with expertise in animal welfare.
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 block">Vikram Mehta</strong>
                    <span className="text-gray-600 text-sm">Chief Technology Officer</span>
                    <p className="text-gray-700 mt-1 text-sm">
                      Built Petrosia's platform from the ground up. Leads our engineering and development teams.
                    </p>
                  </li>
                  <li>
                    <strong className="text-gray-900 block">Dr. Priya Patel</strong>
                    <span className="text-gray-600 text-sm">Chief Veterinary Advisor</span>
                    <p className="text-gray-700 mt-1 text-sm">
                      Ensures all health and welfare standards are maintained across the platform.
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Our Mission & Values
                </h3>
                <p className="text-gray-700 mb-6">
                  At Petrosia, we believe that every pet deserves a loving home and every pet owner deserves a trusted companion. Our mission is to create the most trusted, transparent, and ethical pet marketplace in India, where the welfare of animals always comes first.
                </p>
                <div className="space-y-4">
                  <div className="flex">
                    <Target className="h-5 w-5 text-orange-500 mr-3 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Animal Welfare First</strong>
                      <p className="text-gray-700 text-sm">
                        We never compromise on the health and wellbeing of animals on our platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Shield className="h-5 w-5 text-orange-500 mr-3 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Trust & Transparency</strong>
                      <p className="text-gray-700 text-sm">
                        We verify all sellers and provide complete, honest information about every pet.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Award className="h-5 w-5 text-orange-500 mr-3 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Quality Over Quantity</strong>
                      <p className="text-gray-700 text-sm">
                        We focus on quality connections between ethical breeders and loving homes.
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Map className="h-5 w-5 text-orange-500 mr-3 mt-1 shrink-0" />
                    <div>
                      <strong className="text-gray-900 block">Community Building</strong>
                      <p className="text-gray-700 text-sm">
                        We aim to create a supportive community of pet lovers across India.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
              Petrosia Today
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">30+</div>
                <div className="text-gray-700">Cities Across India</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">5,000+</div>
                <div className="text-gray-700">Monthly Adoptions</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">1,500+</div>
                <div className="text-gray-700">Verified Breeders</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-3xl font-bold text-orange-500 mb-2">150+</div>
                <div className="text-gray-700">Team Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Connect With Us
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Have questions or want to learn more about Petrosia? We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact-us" className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Contact Our Team
              </a>
              <a href="/careers" className="bg-white border border-gray-300 hover:border-primary text-gray-800 hover:text-primary font-medium py-3 px-6 rounded-lg transition-colors">
                Join Our Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;