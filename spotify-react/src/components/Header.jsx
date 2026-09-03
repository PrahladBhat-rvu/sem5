function Header() {
  return (
    <header className="header">
      <h2>Spotify</h2>

      <input
        type="text"
        placeholder="What do you want to play?"
      />

      <button>Log in</button>
    </header>
  );
}

export default Header;