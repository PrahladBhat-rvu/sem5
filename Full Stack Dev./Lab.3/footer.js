import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-column">
        <h3>Company</h3>
        <a href="/">About</a>
        <a href="/">Jobs</a>
        <a href="/">For the Record</a>
      </div>

      <div className="footer-column">
        <h3>Communities</h3>
        <a href="/">Artists</a>
        <a href="/">Developers</a>
        <a href="/">Advertising</a>
      </div>

      <div className="footer-column">
        <h3>Useful Links</h3>
        <a href="/">Support</a>
        <a href="/">Free Mobile App</a>
      </div>

    </footer>
  );
}

export default Footer;
