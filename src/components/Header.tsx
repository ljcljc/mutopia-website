import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
const mutopiaLogo = "/images/mutopia-logo.png";
import { AuthDialog } from "./AuthDialog";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 rounded-b-3xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={mutopiaLogo}
              alt="Mutopia Logo"
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-secondary">Mutopia</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#packages" className="text-foreground hover:text-primary transition-colors">
              Packages
            </a>
            <a href="#why-us" className="text-foreground hover:text-primary transition-colors">
              Why Us
            </a>
            <a href="#faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="rounded-full h-8 px-4">Apply to Groomer</Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full h-8 px-4"
              onClick={() => setIsAuthDialogOpen(true)}
            >
              Login / Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                Services
              </a>
              <a href="#packages" className="text-foreground hover:text-primary transition-colors">
                Packages
              </a>
              <a href="#why-us" className="text-foreground hover:text-primary transition-colors">
                Why Us
              </a>
              <a href="#faq" className="text-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm" className="rounded-full h-8">Apply to Groomer</Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full h-8"
                  onClick={() => setIsAuthDialogOpen(true)}
                >
                  Login / Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </header>
  );
}
