import { useRestaurants } from "../hooks/useRestaurants"; // use the new JS hook
import RestaurantCard from "./RestaurantCard";

const AllRestaurants = () => {
  const { restaurants, loading } = useRestaurants();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading restaurants...</p>
      </div>
    );

  const allRestaurants = restaurants || [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
          All Restaurants
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allRestaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllRestaurants;
