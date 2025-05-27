import { Star } from "lucide-react";

type TestimonialProps = {
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
  rating: number;
};

const Testimonial = ({ name, role, avatarUrl, text, rating }: TestimonialProps) => {
  return (
    <div className="bg-neutral-50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="text-lg font-medium text-neutral-900">{name}</h4>
          <p className="text-neutral-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-neutral-700">{text}</p>
      <div className="mt-4 flex text-primary">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
        {rating < 5 && 
          <Star className="h-5 w-5 fill-current text-opacity-50" />
        }
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Pet Parent",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "I found my adorable Golden Retriever puppy through Petrosia. The process was smooth, and I appreciated how transparent the seller was about the puppy's health and background.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Breeder",
      avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "As a breeder, Petrosia has helped me connect with serious pet lovers who provide good homes for my puppies. The platform is easy to use and brings quality inquiries.",
      rating: 4,
    },
    {
      name: "Meera Patel",
      role: "Adopted from Shelter",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "I adopted my cat from a shelter I discovered on Petrosia. The platform made it easy to browse adoption options, and the shelter was very helpful throughout the process.",
      rating: 5,
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
            What Our Users Say
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Hear from happy pet parents and sellers who found success on Petrosia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
