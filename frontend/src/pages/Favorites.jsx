import { useEffect, useState } from "react";
import axios from "axios";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      await axios.delete("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
        data: { restaurantId }, // <-- send as body
      });

      // Update state locally
      setFavorites((prev) =>
        prev.filter(
          (f) => f.restaurantId !== restaurantId && f.osm_id !== restaurantId,
        ),
      );
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      alert("Failed to remove favorite");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((r, index) => {
            const locationStr =
              [r.street, r.housenumber, r.kebele, r.subcity, r.city]
                .filter(Boolean)
                .join(", ") || "Addis Ababa";

            return (
              <div
                key={r.osm_id || r._id || index}
                className="bg-card rounded-2xl shadow-soft p-4 relative"
              >
                <h2 className="text-lg font-semibold">{r.name || "Unnamed"}</h2>
                {r.name_am && (
                  <p className="text-sm text-muted-foreground mb-2">
                    ({r.name_am})
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-2">
                  {r.cuisine || "Unknown cuisine"} | {r.amenity || "N/A"}
                </p>

                <div className="text-sm mb-2">
                  <p>📍 {locationStr}</p>
                  {r.phone && <p>📞 {r.phone}</p>}
                  {r.website && (
                    <p>
                      🌐{" "}
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Website
                      </a>
                    </p>
                  )}
                </div>

                {r.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {r.description}
                  </p>
                )}

                {/* Remove favorite button */}
                <button
                  onClick={() => removeFavorite(r.osm_id)} // pass osm_id since backend expects numeric restaurantId
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700"
                  title="Remove from favorites"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;
