import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Downtown Toronto",
      avatar: "SC",
      rating: 5,
      text: "Mutopia has been a game-changer for us! My Golden Retriever Max used to get so stressed at traditional groomers, but now he's relaxed and happy during his grooming sessions. The convenience of having them come to our home is incredible.",
      petName: "Max"
    },
    {
      name: "Mike Rodriguez",
      location: "Mississauga",
      avatar: "MR", 
      rating: 5,
      text: "I've been using Mutopia for over a year with my two cats, and I couldn't be happier. The groomers are so gentle and professional. Both Luna and Shadow actually seem to enjoy their spa days now!",
      petName: "Luna & Shadow"
    },
    {
      name: "Emma Thompson",
      location: "North York",
      avatar: "ET",
      rating: 5,
      text: "The Premium Plus package is perfect for our busy family. Our Poodle Charlie always looks amazing, and the monthly photo updates are such a nice touch. Worth every penny!",
      petName: "Charlie"
    },
    {
      name: "David Kim", 
      location: "Scarborough",
      avatar: "DK",
      rating: 5,
      text: "As a first-time dog owner, I was nervous about grooming. The Mutopia team educated me about proper care and made the whole experience stress-free. Highly recommend!",
      petName: "Bella"
    },
    {
      name: "Lisa Anderson",
      location: "Etobicoke", 
      avatar: "LA",
      rating: 5,
      text: "The mobile service is perfect for my senior dog who has mobility issues. The groomers are patient, caring, and skilled. It's like having a spa come to your door!",
      petName: "Buddy"
    },
    {
      name: "James Wilson",
      location: "Richmond Hill",
      avatar: "JW",
      rating: 5,
      text: "Mutopia transformed my rescue dog's anxiety around grooming. Their gentle approach and expertise helped build his confidence. Now he actually gets excited when he sees the van!",
      petName: "Rocky"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Pet Parents Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what thousands of satisfied customers 
            and their furry friends have to say about Mutopia.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600">Happy Pets</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-600">Grooming Sessions</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="text-blue-200 mb-4" size={32} />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="" alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                    <div className="text-sm text-blue-600">Pet parent to {testimonial.petName}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Before/After Gallery */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Amazing Transformations
            </h3>
            <p className="text-gray-600">
              See the incredible results our professional groomers achieve
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1658595148900-c77873724e98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBwZXQlMjBzcGElMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk0OTU1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional pet grooming setup"
                className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-semibold mb-2">Professional Setup</h4>
                  <p className="text-sm opacity-90">State-of-the-art mobile grooming stations</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1644675443401-ea4c14bad0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2clMjBncm9vbWVyJTIwd29ya2luZ3xlbnwxfHx8fDE3NTk0MjE4MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional groomer at work"
                className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-semibold mb-2">Expert Care</h4>
                  <p className="text-sm opacity-90">Certified professionals who love what they do</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}