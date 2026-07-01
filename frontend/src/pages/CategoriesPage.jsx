import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { categories } from "../data/restaurants.js";

const CategoriesPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Cuisine Categories - BitesFinder | Explore Food Types in Addis Ababa
        </title>
        <meta
          name="description"
          content="Browse restaurants by cuisine category. Ethiopian, Italian, Mexican, Fast Food, Desserts, and more dining options in Addis Ababa."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Cuisine Categories
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore restaurants by the type of food you're craving
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/restaurants?cuisine=${category.name}`}
                  className="group bg-card rounded-2xl p-8 shadow-soft card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {category.count} restaurants
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CategoriesPage;
