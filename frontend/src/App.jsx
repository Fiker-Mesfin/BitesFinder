import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";

import Favorites from "./pages/Favorites.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthLayout from "./pages/AuthLayout";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import FavoritesProvider from "./hooks/FavoritesContext";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <FavoritesProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthLayout />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route
                path="/restaurant/discover/:name"
                element={<RestaurantDetail />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/favorites" element={<Favorites />} />

              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FavoritesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
