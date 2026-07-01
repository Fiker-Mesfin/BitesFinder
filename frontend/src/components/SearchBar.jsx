import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

const SearchBar = ({ backendUrl = "http://localhost:5000/api" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch restaurants as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${backendUrl}/restaurants?cuisine=${encodeURIComponent(query.trim())}&limit=10`,
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchRestaurants, 300); // debounce for 300ms
    return () => clearTimeout(debounce);
  }, [query, backendUrl]);

  return (
    <div className="relative max-w-xl mx-auto w-full">
      <div>
        <input
          type="text"
          placeholder="Search restaurants by name or cuisine..."
          className="w-full pl-12 pr-4 py-3 rounded-full border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
      </div>

      {/* Dropdown with live results */}
      {query && results.length > 0 && (
        <div className="absolute z-50 w-full bg-card border border-border mt-2 rounded-lg shadow-lg max-h-96 overflow-auto">
          {loading && <p className="p-4 text-center">Loading...</p>}

          {!loading &&
            results.map((r) => (
              <div
                key={r.osm_id || r._id}
                onClick={() => navigate(`/restaurant/${r.osm_id || r._id}`)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-border"
              >
                <img
                  src={
                    r.image ||
                    `https://source.unsplash.com/featured/?restaurant,food,${r.cuisine}`
                  }
                  alt={r.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {r.cuisine} •{" "}
                    {r.subcity || r.kebele || r.city || "Addis Ababa"}
                  </p>
                  {r.opening_hours && (
                    <p className="text-xs text-muted-foreground">
                      Hours: {r.opening_hours}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
