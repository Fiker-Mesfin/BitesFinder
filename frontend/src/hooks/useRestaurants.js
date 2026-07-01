import { useState, useEffect } from "react";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        console.log("Fetched data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Expected an array of restaurants from API");
        }
        const mapped = data
          .filter((r) => r.name && r.name.trim() !== "") // <-- Skip restaurants with no name
          .map((r) => ({
            _id: r.osm_id,
            name: r.name,
            name_am: r.name_am,
            name_en: r.name_en,
            cuisine: r.cuisine,
            amenity: r.amenity,
            description: r.description,
            description_am: r.description_am,
            phone: r.phone,
            street: r.street,
            housenumber: r.housenumber,
            kebele: r.kebele,
            subcity: r.subcity,
            city: r.city,
            lat: r.lat,
            lon: r.lon,
            location: r.subcity || r.kebele || r.city || "",

            image: `https://source.unsplash.com/featured/?restaurant,food,${r.cuisine}`,
            rating: r.rating || 4.2,
            priceRange: "$$",
            tags: [r.cuisine, r.city || "Addis Ababa"],
            isPopular: Math.random() > 0.7, // Now only for restaurants with name
            reviewCount: Math.floor(Math.random() * 200),
          }));

        console.log("Mapped restaurants:", mapped); // 🔍 Debug: check locations
        setRestaurants(mapped);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return { restaurants, loading };
}
