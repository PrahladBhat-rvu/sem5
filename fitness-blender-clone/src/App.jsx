import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Navbar />

      <Hero />

      <main>
        <section className="feature-grid">
          <FeatureCard
            className="trainer-series"
            title="Trainer Series"
            description="Exercise with your favorite trainer in our new Trainer Series programs."
            buttonText="View Series"
          />

          <FeatureCard
            className="free-membership"
            title={
              <>
                Earn a Free Plus
                <br />
                Membership
              </>
            }
            description="Share your referral code and every sign up earns rewards to put toward your membership."
            buttonText="Learn About Rewards"
          />

          <FeatureCard
            className="powerblock"
            title={
              <>
                Small Footprint
                <br />
                Big Gains
              </>
            }
            description="The perfect dumbbells for any space. Use discount code FBXPB20 for $20 off an order of $200 or more."
            buttonText="Shop PowerBlock"
          />

          <FeatureCard
            className="specialty"
            title="Specialty Content"
            description="Pilot programs provide special content tailored to smaller audiences, conditions, or life events."
            buttonText="Browse Pilot Programs"
          />

          <FeatureCard
            className="workout-videos"
            title="Workout Videos"
            description="Exercise with certified personal trainers whether you're at home or on the road."
            buttonText="Find a Workout"
          />

          <FeatureCard
            className="community"
            title={
              <>
                Supportive
                <br />
                Community
              </>
            }
            description="Stay motivated and engaged with a little help from a supportive community of other members."
            buttonText="Visit Community"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;