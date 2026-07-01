import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  Star,
  MapPin,
  Phone,
  Utensils,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Building2,
  Send,
  Flame,
  Info,
} from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import "./RestaurantDetail.css";
import { cuisineImages } from "../utils/cuisineImages";
import { useAuth } from "../hooks/useAuth"; // <-- add this
// ---------- Cuisine inference ----------
const inferCuisine = (name = "", amenity = "") => {
  const n = name.toLowerCase();
  if (n.includes("pizza") || n.includes("pasta") || n.includes("roma"))
    return "italian";
  if (n.includes("china") || n.includes("dragon") || n.includes("beijing"))
    return "chinese";
  if (
    n.includes("habesha") ||
    n.includes("addis") ||
    n.includes("sheger") ||
    n.includes("abay") ||
    n.includes("injera")
  )
    return "ethiopian";
  if (amenity === "cafe") return "cafe";
  return "ethiopian";
};

// ---------- AI Menu Generator ----------
const generateAIMenu = (restaurant) => {
  const menus = {
    ethiopian: ["Doro Wat", "Shiro", "Tibs", "Misir Wat", "Gomen", "Beyaynetu"],
    italian: [
      "Margherita Pizza",
      "Pepperoni Pizza",
      "Spaghetti Bolognese",
      "Lasagna",
    ],
    chinese: [
      "Kung Pao Chicken",
      "Fried Rice",
      "Spring Rolls",
      "Sweet & Sour Chicken",
    ],
    cafe: ["Coffee", "Macchiato", "Special Tea", "Sandwich", "Pastries"],
  };
  const cuisine =
    restaurant.cuisine?.toLowerCase() ||
    inferCuisine(restaurant.name, restaurant.amenity);
  const base = menus[cuisine] || menus.ethiopian;
  const seed = (restaurant.name || "")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);

  return base.filter((_, i) => (seed + i) % 2 === 0);
};

const RestaurantDetail = ({ backendUrl = "http://localhost:5000/api" }) => {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const favorited = isFavorite(id);

  // ---------------- Fetch restaurant ----------------
  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/restaurants/${id}`);
        const data = await res.json();

        if (!data) throw new Error("Restaurant not found");

        const infCuisine =
          data.cuisine && data.cuisine !== "Not specified"
            ? data.cuisine
            : inferCuisine(data.name, data.amenity);

        setRestaurant({
          ...data,
          cuisine: infCuisine,
          image:
            cuisineImages[infCuisine?.toLowerCase()] || cuisineImages.default,
          heatLevel: Math.floor(Math.random() * 3) + 1,
        });

        if (data.menu && data.menu.length > 0) setMenu(data.menu);
        else setMenu(generateAIMenu(data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, backendUrl]);

  // ---------------- Fetch comments ----------------
  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${backendUrl}/comments/${id}`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [id, backendUrl]);

  // Post comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = // Example for posting comment
        await fetch(`${backendUrl}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: Number(restaurant.osm_id), // <- must be a number
            text: newComment,
          }),
        });

      const data = await res.json();
      setComments([data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  if (loading || !restaurant)
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Finding the best table for you...</p>
      </div>
    );

  return (
    <div className="restaurant-detail">
      {/* Navbar */}
      <nav className="header-nav">
        <Link to="/restaurants" className="back-btn">
          <ArrowLeft size={24} />
        </Link>
        <div className="verified">
          <ShieldCheck size={14} /> BitesFinder Verified
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-image">
            <img src={restaurant.image} alt={restaurant.name} />

            <div className="heat">
              {[...Array(restaurant.heatLevel)].map((_, i) => (
                <Flame key={i} size={18} className="heat-flame" />
              ))}
            </div>
          </div>
          <div className="hero-info">
            <div className="cuisine-label">
              <Sparkles size={16} /> Featured {restaurant.cuisine}
            </div>
            <h1>{restaurant.name}</h1>
            {restaurant.name_am && (
              <p className="local-name">{restaurant.name_am}</p>
            )}
            <div className="hero-stats">
              <div className="rating">
                <Star size={18} /> {restaurant.rating || "4.5"}
              </div>
              <div className="cuisine">
                <Utensils size={18} /> {restaurant.cuisine}
              </div>
            </div>
          </div>
        </section>

        <div className="content-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Location & Contact */}
            <div className="info-card">
              <h3>
                <MapPin size={26} /> Location & Contact
              </h3>
              <p className="label">Address</p>
              <p className="info">
                {restaurant.street ? `${restaurant.street}, ` : ""}
                {restaurant.housenumber ? `${restaurant.housenumber}, ` : ""}
                {restaurant.kebele ? `${restaurant.kebele}, ` : ""}
                {restaurant.subcity ? `${restaurant.subcity}, ` : ""}
                {restaurant.city || "Addis Ababa"}
              </p>
              {restaurant.phone && (
                <>
                  <p className="label">Phone</p>
                  <p className="info">
                    <Phone size={16} /> {restaurant.phone}
                  </p>
                </>
              )}
              {restaurant.opening_hours && (
                <>
                  <p className="label">Opening Hours</p>
                  <p className="info">{restaurant.opening_hours}</p>
                </>
              )}
              {restaurant.priceRange && (
                <>
                  <p className="label">Price Range</p>
                  <p className="info">{restaurant.priceRange}</p>
                </>
              )}
            </div>

            {/* Menu */}
            <div className="menu-card">
              <div className="menu-header">
                <h3>Menu</h3>
                <span>Preview</span>
              </div>
              <div className="menu-grid">
                {menu.map((item, i) => (
                  <div key={i} className="menu-item">
                    {item} <Sparkles size={16} />
                  </div>
                ))}
              </div>
              {!restaurant.menu && (
                <div className="menu-notice">
                  <Info size={20} />
                  Official menu appears after owner uploads.
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="comments-card">
              <h3>
                <MessageSquare size={26} /> Customer Buzz
              </h3>
              <div className="comments-list">
                {Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((c, i) => {
                    const commentDate = c.date ? new Date(c.date) : new Date();
                    const commentText = c.text || "";

                    return (
                      <div key={c._id || i} className="comment">
                        <div className="avatar">
                          {user
                            ? user.displayName?.charAt(0).toUpperCase() || "U"
                            : "G"}
                        </div>
                        <div className="comment-text">
                          <div className="comment-header">
                            <span>
                              {user ? user.displayName : "Guest User"}
                            </span>
                            <span>{commentDate.toLocaleDateString()}</span>
                          </div>
                          <p>{commentText}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No reviews yet. Be the first!</p>
                )}
              </div>

              <div className="comment-input">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us about the taste..."
                />
                <button
                  onClick={async () => {
                    if (!newComment.trim()) return;

                    // Debug: Check restaurant ID and comment
                    const restaurantId = Number(
                      restaurant.osm_id || restaurant._id,
                    );
                    console.log(
                      "➡ Posting comment for restaurantId:",
                      restaurantId,
                    );
                    console.log("➡ Comment text:", newComment);

                    if (isNaN(restaurantId)) {
                      console.error("❌ Invalid restaurant ID:", restaurantId);
                      return;
                    }

                    try {
                      const res = await fetch(`${backendUrl}/comments`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          restaurantId,
                          text: newComment,
                        }),
                      });

                      const data = await res.json();
                      console.log("⬅ Response from backend:", data);

                      if (res.ok) {
                        setComments([data, ...comments]);
                        setNewComment("");
                      } else {
                        console.error("❌ Failed to post comment:", data.error);
                      }
                    } catch (err) {
                      console.error("❌ Fetch error:", err);
                    }
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="claim-card">
              <h3>
                <Building2 size={22} /> Claim Venue
              </h3>
              <p>
                Verify this business to upload official menus, update prices,
                and respond to customers.
              </p>
              <button>Verify & Update Now</button>
              <p>If you are the owner, contact us</p>
            </div>

            <div className="trending-card">
              <Flame size={40} />
              <h4>Trending Spot</h4>
              <p>
                This restaurant is currently being discovered by foodies in the{" "}
                {restaurant.cuisine} category.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetail;
