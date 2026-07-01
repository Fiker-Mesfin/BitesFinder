import { useNavigate } from "react-router-dom";
import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background gradient and decorative blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-background to-muted" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-fade-in">
          <Utensils className="w-4 h-4" />
          <span className="text-sm font-medium">
            Discover 200+ Restaurants in Addis Ababa
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6 animate-slide-up text-center">
          Find Your Next
          <span className="block text-gradient">Favorite Bite</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-100 text-center">
          Explore the best restaurants, cafes, and eateries across Addis Ababa.
          From traditional Ethiopian cuisine to international flavors.
        </p>

        {/* Explore Button (replaces search bar) */}
        <div className="max-w-2xl w-full animate-slide-up delay-200 flex justify-center">
          <Button
            variant="hero"
            size="lg"
            className="sm:px-8"
            onClick={() => navigate("/restaurants")}
          >
            Explore
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 animate-slide-up delay-300">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
              200+
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Restaurants
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
              8
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Cuisine Types
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
              6
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Neighborhoods
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-foreground">
              5+
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Happy Users
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
