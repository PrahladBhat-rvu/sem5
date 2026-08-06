import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <main className="content">
        <h1>Spotify Clone</h1>
        <p>This area represents the application content.</p>
      </main>

      <Footer />
    </>
  );
}

export default App;
