import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = createContext();

const API_URL = "http://localhost:5000/api"; // adjust if needed
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false); // <-- add this

  const token = localStorage.getItem("token");

  // axios config
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // fetchFavorites
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/favorites`, authConfig);
      setFavorites(res.data.map((fav) => fav.restaurantId));
      return res.data;
    } catch (err) {
      console.error("Error fetching favorites:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  // ---------------- ADD / REMOVE FAVORITE ----------------
  const toggleFavorite = async (restaurantId) => {
    if (!token) {
      alert("Please sign in first");
      return;
    }

    const exists = favorites.some((fav) => fav.restaurantId === restaurantId);

    try {
      if (exists) {
        // REMOVE
        await axios.delete(`${API_URL}/favorites`, {
          ...authConfig,
          data: { restaurantId },
        });

        setFavorites((prev) =>
          prev.filter((fav) => fav.restaurantId !== restaurantId),
        );
      } else {
        // ADD
        const res = await axios.post(
          `${API_URL}/favorites`,
          { restaurantId },
          authConfig,
        );

        setFavorites((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // ---------------- CHECK FAVORITE ----------------
  const isFavorite = (restaurantId) => {
    return favorites.some((fav) => fav.restaurantId === restaurantId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// ✅ THIS FIXES YOUR EXPORT ERRORS
export const useFavoritesContext = () => useContext(FavoritesContext);

export default FavoritesProvider;
