// frontend/components/RestaurantCard.jsx
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { cuisineImages } from "../utils/cuisineImages";
import { useFavorites } from "../hooks/useFavorites"; // ✅ use the hook directly

const getRestaurantImage = (restaurant) => {
  const keywords = Object.keys(cuisineImages);
  const text =
    `${restaurant.cuisine || ""} ${restaurant.name || ""}`.toLowerCase();

  const match = keywords.find((key) => text.includes(key.toLowerCase()));
  const image = cuisineImages[match] || cuisineImages.default;

  if (Array.isArray(image)) {
    const randomIndex = Math.floor(Math.random() * image.length);
    return image[randomIndex];
  }

  return image;
};

const RestaurantCard = ({ restaurant }) => {
  const { toggleFavorite, isFavorite, loading } = useFavorites(); // ✅ new hook
  const favorited = isFavorite(restaurant._id); // make sure _id is string or ObjectId

  const getPriceDisplay = (priceRange) => {
    const count = priceRange ? priceRange.length : 1;
    return (
      <div className="flex items-center gap-1 text-sm">
        {"💲💲💲💲".slice(0, count)}
      </div>
    );
  };

  const getStars = (count) => {
    let stars = 1;
    if (count >= 100) stars = 5;
    else if (count >= 50) stars = 4;
    else if (count >= 25) stars = 3;
    else if (count >= 10) stars = 2;
    return "⭐".repeat(stars);
  };

  const locationStr =
    [
      restaurant.street,
      restaurant.housenumber,
      restaurant.kebele,
      restaurant.subcity,
      restaurant.city,
    ]
      .filter(Boolean)
      .join(", ") || "Addis Ababa";

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover">
      {/* Image & Heart */}
      <div className="relative h-48 overflow-hidden block">
        <Link to={`/restaurant/${restaurant._id}`}>
          <img
            src={getRestaurantImage(restaurant)}
            alt={restaurant.name}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee/60 via-transparent to-transparent pointer-events-none" />
        </Link>

        {restaurant.isPopular && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            Popular
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={(e) => {
            e.preventDefault(); // prevent Link navigation
            e.stopPropagation();
            toggleFavorite(restaurant._id);
          }}
          disabled={loading} // prevent multiple clicks
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            favorited
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {restaurant.name}{" "}
          {restaurant.name_am && (
            <span className="text-sm text-muted-foreground">
              ({restaurant.name_am})
            </span>
          )}
        </h3>

        <p className="text-sm text-muted-foreground mb-2">
          {restaurant.cuisine} | {restaurant.amenity}
        </p>

        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center gap-1">
            <span>{getStars(restaurant.reviewCount || 0)}</span>
            <span className="ml-1">
              ({restaurant.reviewCount || 0} rating count)
            </span>
          </div>
          {getPriceDisplay(restaurant.priceRange)}
        </div>

        <div className="flex flex-col gap-1 text-sm mb-3">
          <span>📍 {locationStr}</span>
          {restaurant.phone && <span>📞 {restaurant.phone}</span>}
          {restaurant.website && (
            <span>
              🌐{" "}
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Website
              </a>
            </span>
          )}
          {restaurant["website:menu"] && (
            <span>
              📋{" "}
              <a
                href={restaurant["website:menu"]}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Menu
              </a>
            </span>
          )}
          {restaurant.opening_hours && (
            <span>⏰ {restaurant.opening_hours}</span>
          )}
          {restaurant.payment && (
            <span>💳 Payments: {restaurant.payment.join(", ")}</span>
          )}
          {restaurant.diet && (
            <span>
              🥗 Diet:{" "}
              {Object.entries(restaurant.diet)
                .map(([k, v]) => `${k}=${v}`)
                .join(", ")}
            </span>
          )}
        </div>

        {restaurant.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {restaurant.description}
          </p>
        )}

        <Link to={`/restaurant/${restaurant._id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
