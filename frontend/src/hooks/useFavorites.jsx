import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import axios from "axios";
import { toast } from "./use-toast"; // optional toast notifications

const API_URL = "http://localhost:5000/api";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]); // array of restaurantId (numbers)
  const [loading, setLoading] = useState(false);

  // ------------------ Fetch favorites ------------------
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // backend returns restaurant objects, so use osm_id
      setFavorites(res.data.map((restaurant) => restaurant.osm_id));
      return res.data; // full objects for page rendering
    } catch (err) {
      console.error("Error fetching favorites:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Toggle favorite ------------------
  const toggleFavorite = async (restaurantId) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please log in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    const isFavorited = favorites.includes(restaurantId);

    try {
      if (isFavorited) {
        // DELETE
        await axios.delete(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { restaurantId }, // DELETE body requires `data` in axios
        });
        setFavorites((prev) => prev.filter((id) => id !== restaurantId));
        toast({ title: "Removed from favorites" });
      } else {
        // POST
        await axios.post(
          `${API_URL}/favorites`,
          { restaurantId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setFavorites((prev) => [...prev, restaurantId]);
        toast({ title: "Added to favorites" });
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update favorite",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (restaurantId) => favorites.includes(restaurantId);

  return { favorites, loading, toggleFavorite, isFavorite };
};
