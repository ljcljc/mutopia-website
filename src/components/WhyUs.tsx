import { Shield, Clock, Users, Award, Heart, Smartphone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function WhyUs() {
  const features = [
    {
      icon: Shield,
      title: "Certified Professionals",
      description: "All our groomers are certified, insured, and background-checked for your peace of mind."
    },
    {
      icon: Clock,
      title: "Convenient Scheduling",
      description: "Book appointments online 24/7. We work around your schedule, not the other way around."
    },
    {
      icon: Users,
      title: "Personalized Care",
      description: "Every pet is unique. We tailor our services to your pet's specific needs and temperament."
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "We use only the finest, pet-safe products and state-of-the-art equipment."
    },
    {
      icon: Heart,
      title: "Stress-Free Experience",
      description: "Mobile service means no stressful car rides. Your pet stays comfortable at home."
    },
    {
      icon: Smartphone,
      title: "Real-Time Updates",
      description: "Get photos and updates throughout the grooming process via our mobile app."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-white relative overflow-hidden">
      {/* Curved Background */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 1200 120" className="absolute top-0 w-full h-32 text-accent">
          <path d="M0,0 C300,100 900,20 1200,60 L1200,0 Z" fill="currentColor"/>
        </svg>
        <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-32 text-accent rotate-180">
          <path d="M0,0 C300,100 900,20 1200,60 L1200,0 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose Mutopia?
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            We're not just another grooming service. We're pet care specialists who understand 
            that your furry family members deserve the very best.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1728448644193-34eb04460c95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGFmdGVyJTIwZ3Jvb21pbmd8ZW58MXx8fHwxNzU5NDk1NTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Happy dog after professional grooming"
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* Stats Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-foreground/60">Certified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Same Day</div>
                  <div className="text-sm text-foreground/60">Availability</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">Mobile</div>
                  <div className="text-sm text-foreground/60">Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}