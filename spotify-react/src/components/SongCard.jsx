function SongCard({ title, artist, onPlay }) {
  function handlePlay() {
    onPlay({
      title: title,
      artist: artist
    });
  }

  return (
    <div className="song-card">
      <div className="album-image"></div>

      <h3>{title}</h3>
      <p>{artist}</p>

      <button onClick={handlePlay}>
        Play
      </button>
    </div>
  );
}

export default SongCard;