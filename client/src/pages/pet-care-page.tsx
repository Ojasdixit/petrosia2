import React from "react";
import { Shield, AlertCircle, Check, X } from "lucide-react";

const PetCarePage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pet Care Essentials
            </h1>
            <p className="text-lg text-gray-700">
              Learn how to keep your furry friends healthy, happy, and thriving
              with our comprehensive pet care guide.
            </p>
          </div>
        </div>
      </section>

      {/* General Pet Care Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              General Pet Care Tips
            </h2>
            
            <div className="bg-orange-50 rounded-xl p-8 mb-12">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  The Basics of Pet Care
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Regardless of what kind of pet you have, all pets need certain basic care to stay healthy and happy. Here are some fundamental aspects of pet care that every pet owner should know:
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">1</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Proper Nutrition</strong> - Feed your pet a balanced, species-appropriate diet that meets their nutritional needs. Consult with your veterinarian about the best food choices for your pet's specific needs.
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">2</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Fresh Water</strong> - Always provide clean, fresh water for your pet. Change the water daily and clean water bowls regularly to prevent bacteria growth.
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">3</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Regular Exercise</strong> - Physical activity is essential for maintaining your pet's health and preventing behavioral problems. The type and amount of exercise will vary depending on your pet's species, breed, age, and health status.
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">4</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Veterinary Care</strong> - Regular check-ups, vaccinations, and preventive treatments (like flea, tick, and heartworm prevention) are crucial for your pet's health. Don't wait until your pet is sick to visit the vet.
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">5</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Grooming</strong> - Regular grooming keeps your pet's coat healthy, reduces shedding, and gives you an opportunity to check for any abnormalities like lumps, bumps, or parasites.
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">6</span>
                    </div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Mental Stimulation</strong> - Provide toys, games, and interaction to keep your pet mentally stimulated and prevent boredom, which can lead to destructive behaviors.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Pet Care Do's and Don'ts
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Do's</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> schedule regular veterinary check-ups, even when your pet seems healthy.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> maintain a consistent feeding schedule with appropriate portions.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> provide your pet with a comfortable, safe place to sleep.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> socialize your pets from a young age to help them become well-adjusted adults.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> keep your pet's vaccinations up to date.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> use positive reinforcement training methods.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> keep identification on your pet at all times (collar tag, microchip).</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> provide plenty of fresh, clean water daily.</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Do</strong> research any plants before bringing them into a home with pets, as many are toxic.</span>
                  </li>
                </ul>
              </div>
              
              {/* Don'ts */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Don'ts</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> feed your pet human food without checking if it's safe for them.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> use over-the-counter medications without consulting your vet first.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> leave pets unattended in vehicles, especially in warm weather.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> use punishment-based training methods.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> skip regular parasite prevention (fleas, ticks, heartworm).</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> ignore changes in your pet's behavior or appetite, as these can be signs of illness.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> allow your pet access to dangerous household substances like cleaning products, antifreeze, or certain plants.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> skip dental care, as dental disease can lead to serious health problems.</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-red-600 mr-2 mt-0.5 shrink-0" />
                    <span className="text-gray-700"><strong>Don't</strong> let your pet roam freely outside without supervision.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Care Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Special Care Considerations
            </h2>
            
            <div className="bg-amber-50 rounded-xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Puppies & Kittens
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Young animals require special care during their rapid growth and development phase:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>More frequent feeding with specially formulated puppy/kitten food</li>
                <li>Careful socialization during key developmental periods</li>
                <li>Consistent house training or litter box training</li>
                <li>Multiple vet visits for initial vaccinations and health checks</li>
                <li>Teething considerations and appropriate chew toys</li>
                <li>Starting basic training and establishing good habits early</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Senior Pets
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Older pets often require adjustments to their care routine:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li>More frequent veterinary check-ups (at least twice yearly)</li>
                <li>Possible dietary changes to senior-specific formulations</li>
                <li>Accommodations for arthritis or mobility issues</li>
                <li>Dental care becomes even more important</li>
                <li>Monitoring weight more closely as metabolism changes</li>
                <li>Adjusting exercise routines to appropriate levels</li>
                <li>Being vigilant for age-related health conditions</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">
                  Seasonal Considerations
                </h3>
              </div>
              <p className="text-gray-700 mb-4">
                Different seasons bring different challenges for pet care:
              </p>
              <ul className="space-y-2 text-gray-700 ml-6 list-disc">
                <li><strong>Summer:</strong> Watch for heatstroke, provide shade and plenty of water, never leave pets in hot cars</li>
                <li><strong>Winter:</strong> Protect paws from ice and salt, provide warm shelter, adjust food if outdoor time increases</li>
                <li><strong>Spring/Fall:</strong> Be aware of seasonal allergies, increased parasite activity</li>
                <li><strong>Rainy Season:</strong> Keep pets dry to prevent skin issues, clean paws after walks</li>
                <li><strong>Festival Seasons:</strong> Keep pets away from firecrackers, festive foods, decorations that could be harmful</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetCarePage;