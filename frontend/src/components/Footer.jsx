import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-coffee text-cream/90">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-cream">
                Bites<span className="text-primary">Finder</span>
              </span>
            </Link>
            <p className="text-cream/70 text-sm leading-relaxed mb-6">
              Your ultimate guide to discovering the best restaurants in Addis
              Ababa. From traditional Ethiopian cuisine to international
              flavors.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com" // replace with real page
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/locations"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  Locations
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream mb-4">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                "Ethiopian",
                "Italian",
                "Fast Food",
                "Desserts",
                "Drinks",
                "Asian",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/restaurants?cuisine=${encodeURIComponent(cat)}`}
                    className="text-cream/70 hover:text-primary transition-colors text-sm"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg text-cream mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-cream/70 text-sm">
                  Bole Road, Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:hello@bitesfinder.com"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  hello@bitesfinder.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+251911234567"
                  className="text-cream/70 hover:text-primary transition-colors text-sm"
                >
                  +251 911 234 567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/50 text-sm">
            © {currentYear} BitesFinder. All rights reserved.
          </p>
          <p className="text-cream/50 text-sm">
            Developed by <span className="text-primary">Fiker Mesfin</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
