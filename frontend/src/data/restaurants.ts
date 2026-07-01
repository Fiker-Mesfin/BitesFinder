import { useEffect, useState } from "react";

export interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  location: string;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  rating?: number;
  reviewCount?: number;
  image: string;
  description: string;
  isPopular?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Location {
  id: string;
  name: string;
  restaurantCount: number;
}

// Optional static data
export const categories: Category[] = [
  { id: "1", name: "Ethiopian", icon: "🇪🇹", count: 5 },
  { id: "2", name: "Italian", icon: "🍝", count: 18 },
  { id: "3", name: "Fast Food", icon: "🍔", count: 1 },
  { id: "4", name: "Desserts", icon: "🍰", count: 1 },
  { id: "5", name: "Drinks", icon: "☕", count: 1 },
  { id: "6", name: "Mexican", icon: "🌮", count: 3 },
  { id: "7", name: "Chinese", icon: "🥡", count: 7 },
  { id: "8", name: "French", icon: "🥐", count: 6 },
  { id: "8", name: "Asian", icon: "🍜", count: 2 },
  { id: "8", name: "Arab", icon: "🥙", count: 3 },
  { id: "8", name: "Korean", icon: "🍲🥢", count: 2 },
  { id: "8", name: "Indian", icon: "🥘", count: 1 },
  { id: "8", name: "Turkish", icon: "🥙", count: 1 },
];

export const locations = [
  { id: 1, name: "Bole" },
  { id: 2, name: "Arada" },
  { id: 3, name: "Kirkos" },
  { id: 4, name: "Addis Ketema" },
  { id: 5, name: "Lafto" },
  { id: 6, name: "Lideta" },
];

// --------------------------
// Dynamic fetch for restaurants
// --------------------------
export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants"); // backend endpoint
        const data: Restaurant[] = await res.json();
        // NORMALIZATION: Ensuring every restaurant has a 'location' property
        const normalizedData = data.map((r: any) => ({
          ...r,
          _id: r._id || r.osm_id, // Use osm_id if _id is missing
          // This is the key fix for your filter:
          location: r.subcity || r.city || "Addis Ababa",
          image:
            r.image ||
            `https://source.unsplash.com/featured/?food,${r.cuisine || "restaurant"}`,
          cuisine: r.cuisine || "Local",
        }));

        setRestaurants(normalizedData);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return { restaurants, loading };
};
