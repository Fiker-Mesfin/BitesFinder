import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { locations } from "../data/restaurants";

const Locations = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Explore
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Popular Neighborhoods
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover great dining spots across different areas of Addis Ababa.
            </p>
          </div>
          <Link to="/locations">
            <Button
              variant="ghost"
              className="gap-2 text-primary hover:text-primary"
            >
              All Locations
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <p
              key={location.id}
              to={`/locations/${location.id}`}
              className="group relative bg-card rounded-2xl p-6 shadow-soft card-hover overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {location.restaurantCount} restaurants
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
