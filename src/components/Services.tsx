import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Scissors, Droplets, Brush, Sparkles, Clock, ArrowRight } from "lucide-react";

export function Services() {
  const mainServices = [
    {
      icon: Scissors,
      title: "Full Grooming",
      description: "Complete wash, cut, nail trim, and styling for your pet",
      duration: "2-3 hours",
      price: "From $80",
      features: ["Bath & dry", "Haircut & styling", "Nail trimming", "Ear cleaning", "Teeth brushing"],
      popular: true
    },
    {
      icon: Droplets,
      title: "Bath & Brush",
      description: "Refreshing bath with premium products and thorough brushing",
      duration: "1-2 hours", 
      price: "From $45",
      features: ["Premium shampoo", "Conditioning", "Thorough brushing", "Basic nail trim", "Ear check"],
      popular: false
    },
    {
      icon: Brush,
      title: "Express Groom",
      description: "Quick touch-up for pets who need a fast refresh",
      duration: "45-60 min",
      price: "From $35",
      features: ["Quick wash", "Brush out", "Nail trim", "Sanitary trim", "Face & feet cleanup"],
      popular: false
    }
  ];

  const additionalServices = [
    { name: "Nail Painting", price: "$15" },
    { name: "Teeth Cleaning", price: "$25" },
    { name: "Flea Treatment", price: "$30" },
    { name: "De-shedding Treatment", price: "$35" },
    { name: "Aromatherapy Add-on", price: "$20" },
    { name: "Premium Cologne", price: "$10" }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-accent to-orange-50 relative overflow-hidden">
      {/* Curved decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Premium Services
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            From basic baths to full spa treatments, we offer everything your pet needs 
            to look and feel their absolute best.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainServices.map((service, index) => (
            <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 rounded-3xl border-2 hover:border-primary/20">
              {service.popular && (
                <Badge className="absolute -top-3 left-6 bg-primary text-white rounded-full px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="text-primary" size={32} />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-foreground/70">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary/60" />
                    <span className="text-sm text-foreground/60">{service.duration}</span>
                  </div>
                  <span className="text-xl font-semibold text-primary">{service.price}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Includes:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors py-6">
                  Book Now
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Additional Services</h3>
            <p className="text-foreground/70">Enhance your pet's grooming experience with our premium add-ons</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-primary" size={20} />
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <span className="font-semibold text-primary">{service.price}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Services & Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}