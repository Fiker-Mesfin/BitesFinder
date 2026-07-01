import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cuisineImages } from "../utils/cuisineImages";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();

        // Map to include fallback image and location string
        const mapped = data.map((r) => ({
          ...r,
          location: r.subcity || r.kebele || r.city || "Addis Ababa",
          image: `https://source.unsplash.com/featured/?restaurant,food,${r.cuisine || "food"}`,
        }));

        setRestaurants(mapped);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg text-muted-foreground mt-20">
        Loading restaurants...
      </p>
    );

  if (error)
    return <p className="text-center text-lg text-red-500 mt-20">{error}</p>;

  if (!restaurants.length)
    return (
      <p className="text-center text-lg text-muted-foreground mt-20">
        No restaurants found.
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {restaurants.map((r) => (
        <Link key={r._id} to={`/restaurant/${r._id}`}>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
            <img
              src={
                cuisineImages[r.cuisine?.toLowerCase()] || cuisineImages.default
              }
              alt={r.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />

            <h2 className="font-bold text-lg mb-1">{r.name}</h2>
            <p className="text-sm text-muted mb-1">
              {r.cuisine} — {r.location}
            </p>

            {r.phone && <p className="text-sm mb-1">📞 {r.phone}</p>}
            {r.street && (
              <p className="text-sm mb-1">
                🏠 {r.street} {r.housenumber || ""}
              </p>
            )}
            {r.kebele && <p className="text-sm mb-1">📍 Kebele: {r.kebele}</p>}
            {r.subcity && (
              <p className="text-sm mb-1">🏙 Subcity: {r.subcity}</p>
            )}
            {r.city && <p className="text-sm mb-1">🏛 City: {r.city}</p>}
            {r.opening_hours && (
              <p className="text-sm mb-1">⏰ Opening: {r.opening_hours}</p>
            )}
            {r.description && (
              <p className="text-sm text-muted line-clamp-3">{r.description}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
