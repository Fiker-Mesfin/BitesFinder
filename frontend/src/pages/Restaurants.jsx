import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RestaurantCard from "../components/RestaurantCard";
import { Button } from "../components/ui/button";
import { useRestaurants } from "../hooks/useRestaurants";
import { categories, locations } from "../data/restaurants";

const Restaurants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cuisineQuery = searchParams.get("cuisine");
  const locationQuery = searchParams.get("location");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineQuery || "");
  const [selectedLocation, setSelectedLocation] = useState(locationQuery || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false); // New: show all restaurants on See More

  const { restaurants: allRestaurants, loading } = useRestaurants();

  // Keep filters in sync with URL query
  useEffect(() => {
    setSelectedCuisine(cuisineQuery || "");
    setSelectedLocation(locationQuery || "");
  }, [cuisineQuery, locationQuery]);

  // Filter restaurants client-side
  const filteredRestaurants = allRestaurants
    .filter((r) => r.name) // exclude restaurants with no name
    .filter((r) => {
      const name = r.name?.toLowerCase() || "";
      const cuisine = r.cuisine?.toLowerCase() || "";
      const loc = r.location?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();
      const cuisineFilter = selectedCuisine.toLowerCase();
      const locationFilter = selectedLocation.toLowerCase();

      const matchesSearch = name.includes(search) || cuisine.includes(search);
      const matchesCuisine = !cuisineFilter || cuisine.includes(cuisineFilter);
      const matchesLocation = !locationFilter || loc.includes(locationFilter);

      return matchesSearch && matchesCuisine && matchesLocation;
    });

  // Separate restaurants with extra info vs basic info
  const restaurantsWithExtraInfo = filteredRestaurants.filter(
    (r) =>
      r.phone ||
      r.street ||
      r.housenumber ||
      r.kebele ||
      r.subcity ||
      r.city ||
      r.description ||
      r.website ||
      r.menu,
  );

  const basicInfoRestaurants = filteredRestaurants.filter(
    (r) => !restaurantsWithExtraInfo.includes(r),
  );

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium text-muted-foreground">
          Loading restaurants...
        </p>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>All Restaurants - BitesFinder</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              All Restaurants
            </h1>
            <p className="text-muted-foreground mb-6">
              {filteredRestaurants.length} restaurants available
            </p>

            {/* Search & Filters */}
            <div className="bg-card rounded-2xl p-4 shadow-soft mb-8 border border-border">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-background border border-border focus-within:ring-2 ring-primary/20 transition-all">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button
                  variant="outline"
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </Button>

                <div
                  className={`flex flex-col sm:flex-row gap-4 ${showFilters ? "block" : "hidden lg:flex"}`}
                >
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <option value="">All Cuisines</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-background border border-border text-foreground outline-none cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(showAll
                ? [...restaurantsWithExtraInfo, ...basicInfoRestaurants]
                : restaurantsWithExtraInfo
              ).map((restaurant, index) => (
                <div
                  key={restaurant._id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>

            {/* Show More button */}
            {!showAll && basicInfoRestaurants.length > 0 && (
              <div className="text-center mt-6">
                <Button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                >
                  See More ({basicInfoRestaurants.length})
                </Button>
              </div>
            )}

            {/* No results fallback */}
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                <p className="text-xl font-semibold mb-2">
                  No restaurants found.
                </p>
                <p className="text-muted-foreground mb-8">
                  Try a different search or filter.
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Restaurants;
