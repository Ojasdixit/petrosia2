import { Calendar, MapPin, Clock, Filter, Search, ChevronDown, X } from "lucide-react";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import EventRegistrationForm from "@/components/events/EventRegistrationForm";

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  
  // Use the same events data as in the PetEvents component for consistency
  const events = [
    {
      id: 1,
      title: "Annual Delhi Dog Show",
      date: "April 28, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Jawaharlal Nehru Stadium, Delhi",
      image: "https://images.unsplash.com/photo-1558929996-da64ba858215?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Dog Show",
      bgColor: "bg-amber-500",
      city: "Delhi",
      description: "The biggest dog show in Delhi featuring various breeds, competitions, and awards. Join us for a day of fun with furry friends.",
    },
    {
      id: 2,
      title: "Pet Adoption Camp",
      date: "May 15, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "City Park, Mumbai",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Adoption",
      bgColor: "bg-blue-500",
      city: "Mumbai",
      description: "Find your forever companion at our adoption camp. Many dogs, cats, and small pets waiting for loving homes.",
    },
    {
      id: 3,
      title: "Dog Training Workshop",
      date: "June 5, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Canine Club, Bangalore",
      image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Training",
      bgColor: "bg-green-500",
      city: "Bangalore",
      description: "Learn essential training techniques from expert trainers. Perfect for new pet parents and those looking to teach new tricks.",
    },
    {
      id: 4,
      title: "Mumbai Pupper Pool Party",
      date: "July 3, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "Sunshine Resort, Thane",
      image: "https://static2.tripoto.com/media/filter/nl/img/388225/TripDocument/1527606680_pool3.jpg",
      category: "Pool Party",
      bgColor: "bg-orange-500",
      city: "Mumbai",
      description: "A splashing good time for water-loving dogs! Pools, splash pads, and treats for your furry friends.",
    },
    {
      id: 5,
      title: "Pet Health Awareness Camp",
      date: "July 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Central Community Hall, Chennai",
      image: "https://images.unsplash.com/photo-1612531048118-826c06e9bf5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Health",
      bgColor: "bg-rose-500",
      city: "Chennai",
      description: "Free health checkups, vaccination drives, and expert consultations for all pets. Learn about preventive care.",
    },
    {
      id: 6,
      title: "Pet Photography Day",
      date: "August 12, 2025",
      time: "11:00 AM - 7:00 PM",
      location: "Artsy Studios, Kolkata",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Photography",
      bgColor: "bg-purple-500",
      city: "Kolkata",
      description: "Professional photography sessions for your pets. Capture beautiful memories with your furry friends.",
    },
  ];

  // Filter events based on category and search
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === "all" || event.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                         event.location.toLowerCase().includes(search.toLowerCase()) ||
                         event.city.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(events.map(event => event.category.toLowerCase())));
  const categories = ["all", ...uniqueCategories];

  return (
    <>
      <Helmet>
        <title>Pet Events - Petrosia</title>
        <meta name="description" content="Discover pet events near you on Petrosia" />
      </Helmet>

      <div className="bg-neutral-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Pet Events Near You</h1>
            <p className="text-neutral-600 text-center mb-8">
              Discover and participate in pet events in your city
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search events by name, location or city"
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* City filters for mobile */}
            <div className="flex mt-4 border-b border-gray-200 gap-4 overflow-x-auto pb-1 md:hidden mb-6">
              <button 
                className="text-sm font-medium text-orange-500 border-b-2 border-orange-500 pb-1 px-1"
                onClick={() => setSearch("")}
              >
                All Cities
              </button>
              {["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Pune"].map(city => (
                <button 
                  key={city}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1 px-1"
                  onClick={() => setSearch(city)}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Results count */}
            <p className="text-neutral-600 mb-6">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} 
              {filter !== 'all' && ` in category "${filter.charAt(0).toUpperCase() + filter.slice(1)}"`}
              {search && ` matching "${search}"`}
            </p>

            {/* Events grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No events found</h3>
                <p className="text-neutral-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {setFilter("all"); setSearch("")}}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={event.bgColor.replace('bg-', 'bg-') + ' text-white'}>
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>{event.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-neutral-700 text-sm">{event.description}</p>
                      <div className="grid grid-cols-1 gap-2 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                          {event.time}
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-neutral-400 mt-0.5" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowRegistrationForm(true);
                        }}
                      >
                        Register Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="max-w-3xl p-0 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>Fill out the form below to register for this event</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            {selectedEvent && (
              <EventRegistrationForm 
                eventId={selectedEvent.id}
                eventName={selectedEvent.title}
                eventDate={selectedEvent.date}
                eventLocation={selectedEvent.location}
                onSuccess={() => {
                  setShowRegistrationForm(false);
                  setSelectedEvent(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}