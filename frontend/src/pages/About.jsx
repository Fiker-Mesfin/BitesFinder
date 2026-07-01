import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { Users, Target, Heart, MapPin } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - BitesFinder</title>
        <meta
          name="description"
          content="Learn about BitesFinder - your trusted guide to discovering the best restaurants in Addis Ababa. Our mission, story, and commitment to helping you find great food."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About BitesFinder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion for discovering the best dining experiences
              in Addis Ababa
            </p>
          </section>

          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At BitesFinder, we believe that great food brings people
                together. Our mission is to connect food lovers with the best
                restaurants Addis Ababa has to offer, from traditional Ethiopian
                cuisine to international flavors.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We're passionate about supporting local restaurants and helping
                them reach new customers while making it easier for diners to
                discover hidden gems and beloved favorites alike.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
                alt="BitesFinder Mission"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">
              What We Value
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Passion for Food
                </h3>
                <p className="text-muted-foreground">
                  We're food enthusiasts who understand the joy of discovering a
                  perfect meal.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Community First
                </h3>
                <p className="text-muted-foreground">
                  We support local businesses and build connections within our
                  food community.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Local Expertise
                </h3>
                <p className="text-muted-foreground">
                  Deep knowledge of Addis Ababa's diverse neighborhoods and
                  dining scenes.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                BitesFinder was born from a simple idea: make it easier for
                people to find great restaurants in Addis Ababa. As food lovers
                ourselves, we often struggled to discover new places that
                matched our tastes and preferences.
              </p>
              <p>
                We started by curating a list of our favorite spots across the
                city, from the bustling streets of Bole to the historic charm of
                Piazza. What began as a passion project has grown into a
                comprehensive platform serving thousands of food enthusiasts.
              </p>
              <p>
                Today, BitesFinder features hundreds of restaurants across all
                cuisines and price ranges, helping diners make informed
                decisions and creating memorable dining experiences.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
