import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComplaintDialog from "./ComplaintDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);

  const navLinks = [
    { href: "#home", label: "হোম" },
    { href: "#biography", label: "জীবনী" },
    { href: "#vision", label: "ভিশন" },
    { href: "#news", label: "সংবাদ" },
    { href: "#gallery", label: "গ্যালারি" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bengali font-bold text-lg md:text-xl">খ</span>
              </div>
              <span className="hidden sm:block font-bengali font-semibold text-lg text-foreground">
                খায়রুল কবির খোকন
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-bengali text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA Button - Bright Red/Gold accent */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setIsComplaintOpen(true)}
                className="hidden sm:flex gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30 animate-pulse-soft"
                size="lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-bengali">অভিযোগ / যোগাযোগ</span>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-foreground"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-bengali text-lg text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button 
                onClick={() => {
                  setIsComplaintOpen(true);
                  setIsMenuOpen(false);
                }}
                className="sm:hidden bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full font-semibold shadow-lg"
                size="lg"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-bengali">অভিযোগ / যোগাযোগ</span>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <ComplaintDialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen} />
    </>
  );
};

export default Header;
