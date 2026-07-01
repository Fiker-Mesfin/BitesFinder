import { useState, useEffect } from "react";

export function useRestaurant(id) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Standardize this URL to match your backend route
    const apiUrl =
      (import.meta.env.VITE_API_URL || "http://localhost:5000/api") +
      `/restaurants/${id}`;

    console.log("Hook fetching from:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Map backend fields to match what your frontend expects
        const mapped = {
          _id: data.osm_id,
          name: data.name,
          cuisine: data.cuisine,
          location: data.area,
          lat: data.lat,
          lon: data.lon,
          image: `https://source.unsplash.com/featured/?restaurant,food,${data.cuisine}`,
          rating: data.rating || 4.2,
          priceRange: "$$",
          tags: [data.cuisine, "Addis Ababa"],
        };
        setRestaurant(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurant:", err);
        setLoading(false);
      });
  }, [id]);

  return { restaurant, loading };
}
