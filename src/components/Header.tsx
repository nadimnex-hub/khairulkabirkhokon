import { useState, useEffect } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComplaintDialog from "./ComplaintDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "#home", label: "হোম" },
    { href: "#biography", label: "জীবনী" },
    { href: "#vision", label: "ভিশন" },
    { href: "#news", label: "সংবাদ" },
    { href: "#gallery", label: "গ্যালারি" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-xl shadow-sm" : "bg-background/80 backdrop-blur-xl"
      } border-b border-border/50`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bengali font-bold text-base sm:text-lg md:text-xl">খ</span>
              </div>
              <span className="hidden sm:block font-bengali font-semibold text-base sm:text-lg text-foreground">
                খায়রুল কবির খোকন
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                onClick={() => setIsComplaintOpen(true)}
                className="hidden sm:flex gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg shadow-accent/30"
                size="default"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bengali hidden md:inline">অভিযোগ / যোগাযোগ</span>
                <span className="font-bengali md:hidden">যোগাযোগ</span>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-foreground touch-target"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden fixed inset-0 top-14 sm:top-16 bg-background/98 backdrop-blur-xl transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <nav className="container mx-auto px-4 sm:px-6 py-6 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`font-bengali text-xl text-foreground hover:text-primary transition-all py-4 border-b border-border/30 transform ${
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
            <Button 
              onClick={() => {
                setIsComplaintOpen(true);
                setIsMenuOpen(false);
              }}
              className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground gap-2 w-full font-semibold shadow-lg py-6 text-lg"
              size="lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-bengali">অভিযোগ / যোগাযোগ</span>
            </Button>
          </nav>
        </div>
      </header>

      <ComplaintDialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen} />
    </>
  );
};

export default Header;
