import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Facebook, Instagram, Twitter, Mail, MapPin } from "lucide-react";
const mutopiaLogo = "/images/mutopia-logo.png";

export function Footer() {
  return (
    <footer id="contact" className="bg-secondary text-white">
      {/* Newsletter Section */}
      <div className="bg-primary py-16 rounded-t-[3rem] relative overflow-hidden">
        {/* Curved background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Pet Care Tips</h3>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Get expert grooming tips, seasonal care advice, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white text-gray-900 border-0 rounded-full"
            />
            <Button variant="secondary" className="whitespace-nowrap bg-white text-primary hover:bg-gray-100 rounded-full">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={mutopiaLogo}
                  alt="Mutopia Logo"
                  className="h-10 w-10"
                />
                <h3 className="text-2xl font-bold">Mutopia</h3>
              </div>
              <div>
                <p className="text-gray-400 leading-relaxed">
                  Premium mobile pet grooming services bringing professional care
                  directly to your door. Your pet's comfort is our priority.
                </p>
              </div>

              <div className="space-y-3">

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-primary" />
                  <span>hello@mutopia.ca</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-primary" />
                  <span>Serving Greater Toronto Area</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#packages" className="text-gray-400 hover:text-white transition-colors">Packages</a></li>
                <li><a href="#why-us" className="text-gray-400 hover:text-white transition-colors">Why Choose Us</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/booking" className="text-gray-400 hover:text-white transition-colors">Book Appointment</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Apply to Groomer</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/cancellation" className="text-gray-400 hover:text-white transition-colors">Cancellation Policy</a></li>
                <li><a href="/service-areas" className="text-gray-400 hover:text-white transition-colors">Service Areas</a></li>
                <li><a href="/testimonials" className="text-gray-400 hover:text-white transition-colors">Customer Reviews</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Pet Care Blog</a></li>
              </ul>
            </div>

            {/* Business Hours & Social */}
            <div>
              <h4 className="font-semibold mb-6">Business Hours</h4>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Saturday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-4">Follow Us</h5>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Mutopia. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
