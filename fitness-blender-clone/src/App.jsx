import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";

import { useLanguage } from "./context/LanguageContext";

function App() {
  const { t } = useLanguage();

  return (
    <div className="app">

      <Navbar />

      <Hero />

      <main>

        <section className="feature-grid">

          <FeatureCard
            className="trainer-series"
            title={t.cards.trainer.title}
            description={t.cards.trainer.description}
            buttonText={t.cards.trainer.button}
          />


          <FeatureCard
            className="free-membership"
            title={t.cards.membership.titleLine1}
            titleLine2={t.cards.membership.titleLine2}
            description={t.cards.membership.description}
            buttonText={t.cards.membership.button}
          />


          <FeatureCard
            className="powerblock"
            title={t.cards.powerblock.titleLine1}
            titleLine2={t.cards.powerblock.titleLine2}
            description={t.cards.powerblock.description}
            buttonText={t.cards.powerblock.button}
          />


          <FeatureCard
            className="specialty"
            title={t.cards.specialty.title}
            description={t.cards.specialty.description}
            buttonText={t.cards.specialty.button}
          />


          <FeatureCard
            className="workout-videos"
            title={t.cards.videos.title}
            description={t.cards.videos.description}
            buttonText={t.cards.videos.button}
          />


          <FeatureCard
            className="community"
            title={t.cards.community.titleLine1}
            titleLine2={t.cards.community.titleLine2}
            description={t.cards.community.description}
            buttonText={t.cards.community.button}
          />

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default App;