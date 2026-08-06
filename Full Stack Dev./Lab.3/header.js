import "./Header.css";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        Spotify
      </div>

      <nav>
        <ul className="nav-links">
          <li><a href="/">Premium</a></li>
          <li><a href="/">Support</a></li>
          <li><a href="/">Download</a></li>
          <li className="divider">|</li>
          <li><a href="/">Sign up</a></li>
          <li><button>Log in</button></li>
        </ul>
      </nav>

    </header>
  );
}

export default Header;
