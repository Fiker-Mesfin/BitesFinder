import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { locations } from "../data/restaurants";

const LocationsPage = () => {
  const navigate = useNavigate();

  const handleLocationClick = (locationName) => {
    // Navigate to Restaurants page with query parameter
    navigate(`/restaurants?location=${encodeURIComponent(locationName)}`);
  };

  return (
    <>
      <Helmet>
        <title>
          Locations - BitesFinder | Find Restaurants by Neighborhood
        </title>
        <meta
          name="description"
          content="Discover restaurants by location in Addis Ababa. Browse dining options in Bole, Kazanchis, Piazza, Summit, and other popular neighborhoods."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Explore by Location
              </h1>
              <p className="text-muted-foreground mt-2">
                Find restaurants in your favorite neighborhood of Addis Ababa
              </p>
            </div>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  onClick={() => handleLocationClick(location.name)}
                  className="cursor-pointer group bg-card rounded-2xl overflow-hidden shadow-soft card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  {/* Header with icon */}
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {location.name}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{location.restaurantCount} restaurants</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LocationsPage;
