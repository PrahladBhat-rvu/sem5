import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SongCard from "./components/SongCard";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  const [currentSong, setCurrentSong] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd"
  });

  return (
    <div className="app">
      <Header />

      <div className="content">
        <Sidebar />

        <main className="main">
          <h1>Good evening</h1>

          <div className="songs">

            <SongCard
              title="Blinding Lights"
              artist="The Weeknd"
              onPlay={setCurrentSong}
            />

            <SongCard
              title="As It Was"
              artist="Harry Styles"
              onPlay={setCurrentSong}
            />

            <SongCard
              title="Starboy"
              artist="The Weeknd"
              onPlay={setCurrentSong}
            />

            <SongCard
              title="Levitating"
              artist="Dua Lipa"
              onPlay={setCurrentSong}
            />

          </div>
        </main>
      </div>

      <Footer
        title={currentSong.title}
        artist={currentSong.artist}
      />
    </div>
  );
}

export default App;