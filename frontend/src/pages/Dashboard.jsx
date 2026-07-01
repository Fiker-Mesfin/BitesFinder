// pages/Dashboard.jsx
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularRestaurants from "../components/PopularRestaurants";
import Categories from "../components/Categories";
import Locations from "../components/Locations";
import Footer from "../components/Footer";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>BitesFinder - Dashboard</title>
        <meta
          name="description"
          content="Your personal dashboard with favorites, profile and account actions."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />{" "}
        {/* Header automatically shows signout/favorites/profile for logged-in user */}
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

export default Dashboard;
