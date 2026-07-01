import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import RestaurantCard from "./RestaurantCard";
import { useRestaurants } from "../hooks/useRestaurants"; // Make sure this hook is the new JS one

const PopularRestaurants = () => {
  const { restaurants, loading } = useRestaurants();

  if (loading) return <p>Loading popular restaurants...</p>;

  const popularRestaurants = (restaurants || [])
    .filter((r) => r.isPopular)
    .slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Top Picks
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Popular Restaurants
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover the most loved dining spots in Addis Ababa, handpicked
              based on ratings and reviews.
            </p>
          </div>
          <Link to="/restaurants">
            <Button
              variant="ghost"
              className="gap-2 text-primary hover:text-primary"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRestaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRestaurants;
