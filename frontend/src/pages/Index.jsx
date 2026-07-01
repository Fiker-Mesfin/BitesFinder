import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularRestaurants from "../components/PopularRestaurants";
import Categories from "../components/Categories";
import Locations from "../components/Locations";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>
          BitesFinder - Discover the Best Restaurants in Addis Ababa
        </title>
        <meta
          name="description"
          content="Find your next favorite restaurant in Addis Ababa. Explore Ethiopian cuisine, international flavors, cafes, and more. Browse by category, location, or popularity."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <PopularRestaurants />
          <Categories />
          <Locations />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
