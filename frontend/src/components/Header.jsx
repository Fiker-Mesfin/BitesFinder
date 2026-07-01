import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, MapPin, Search, User, LogOut, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useFavorites } from "../hooks/useFavorites";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth(); // ✅ inside component
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurants", path: "/restaurants" },
    { name: "Categories", path: "/categories" },
    { name: "Locations", path: "/locations" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:shadow-hover transition-shadow duration-300">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Bites<span className="text-primary">Finder</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Search className="w-5 h-5" />
            </Button>

            {!loading &&
              (user ? (
                <>
                  {/* Logged-in buttons */}
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      signOut();
                      navigate("/"); // optional: redirect after sign out
                    }}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  {/* Logged-out buttons */}
                  <Link to="/auth">
                    <Button variant="outline" className="gap-2">
                      <User className="w-4 h-4" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="default">Register</Button>
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile actions */}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50 mt-2">
                {user ? (
                  <>
                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <Heart className="w-4 h-4" /> My Favorites
                      </Button>
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" /> My Profile
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      className="w-full gap-2"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                        navigate("/"); // redirect after sign out
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full gap-2">
                        <User className="w-4 h-4" /> Sign In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
