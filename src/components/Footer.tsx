import { Facebook, Twitter, Youtube, Phone, Mail, MapPin, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { href: "#home", label: "হোম" },
    { href: "#biography", label: "জীবনী" },
    { href: "#vision", label: "ভিশন" },
    { href: "#news", label: "সংবাদ" },
    { href: "#gallery", label: "গ্যালারি" },
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bengali font-bold text-lg sm:text-xl">খ</span>
              </div>
              <div>
                <h3 className="font-bengali font-bold text-base sm:text-lg">খায়রুল কবির খোকন</h3>
                <p className="font-bengali text-xs sm:text-sm text-background/60">সংসদ সদস্য, নরসিংদী</p>
              </div>
            </div>
            <p className="font-bengali text-sm text-background/70 leading-relaxed">
              গণতন্ত্র ও জনগণের অধিকার রক্ষায় নিবেদিত। আপনার কণ্ঠস্বর হতে পেরে গর্বিত।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bengali font-semibold text-base sm:text-lg mb-4 sm:mb-6">দ্রুত লিংক</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    className="font-bengali text-sm text-background/70 hover:text-primary transition-colors touch-target inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bengali font-semibold text-base sm:text-lg mb-4 sm:mb-6">যোগাযোগ</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="font-bengali text-sm text-background/70">নরসিংদী, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="font-bengali text-sm text-background/70">+৮৮০ XXXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-background/70 break-all">contact@example.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bengali font-semibold text-base sm:text-lg mb-4 sm:mb-6">সোশ্যাল মিডিয়া</h4>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors group touch-target"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-background/70 group-hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="font-bengali text-xs sm:text-sm text-background/50 text-center sm:text-left">
              © ২০২৬ খায়রুল কবির খোকন। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <Link 
              to="/admin"
              className="flex items-center gap-2 text-xs sm:text-sm text-background/40 hover:text-background/60 transition-colors touch-target"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
