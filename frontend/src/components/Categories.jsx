import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { categories } from "../data/restaurants"; // fixed path to match JS structure

const Categories = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Browse By
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
              Cuisine Categories
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              From traditional Ethiopian to international cuisines, find exactly
              what you're craving.
            </p>
          </div>
          <Link to="/categories">
            <Button
              variant="ghost"
              className="gap-2 text-primary hover:text-primary"
            >
              All Categories
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <p
              key={category.id}
              to={`/categories/${category.id}`}
              className="group bg-card rounded-2xl p-6 text-center shadow-soft card-hover animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {category.count} places
              </p>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
