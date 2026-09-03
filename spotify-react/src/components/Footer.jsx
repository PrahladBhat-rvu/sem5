function Footer({ title, artist }) {
  return (
    <footer className="footer">

      <div>
        <strong>{title}</strong>
        <p>{artist}</p>
      </div>

      <div>
        <button>⏮</button>
        <button>▶</button>
        <button>⏭</button>
      </div>

      <div>
        🔊 ━━━━━
      </div>

    </footer>
  );
}

export default Footer;