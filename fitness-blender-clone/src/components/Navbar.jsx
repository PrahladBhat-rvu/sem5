function Navbar() {
  return (
    <>
      <div className="announcement-bar">
        <span>
          🔥 Ready for Week 47? Take a peek at the lineup and get ready to hit play!
        </span>

        <span className="announcement-close">×</span>
      </div>

      <header className="navbar">

        {/* LOGO */}
        <div className="navbar-logo">
          <div className="logo-symbol">
            <span></span>
          </div>

          <div className="logo-text">
            <strong>fitness</strong>
            <span>BLENDER</span>
          </div>
        </div>


        {/* NAVIGATION */}
        <nav className="navbar-links">

          <span className="nav-item">
            WORKOUTS
            <i className="chevron"></i>
          </span>

          <span className="nav-item">
            PROGRAMS
            <i className="chevron"></i>
          </span>

          <span className="nav-item">
            HEALTHY LIVING
            <i className="chevron"></i>
          </span>

          <span className="nav-item">
            COMMUNITY
            <i className="chevron"></i>
          </span>

          <span className="nav-item">
            ABOUT
            <i className="chevron"></i>
          </span>

          <span className="nav-item">
            STORE
          </span>

          <span className="nav-item membership">
            MEMBERSHIP
          </span>

        </nav>


        {/* RIGHT SIDE */}
        <div className="navbar-actions">

          <div className="account-info">
            <small>Hi! Sign In</small>

            <strong>
              MY FITNESS
              <i className="chevron"></i>
            </strong>
          </div>

          <span className="search-icon"></span>

          <span className="bag-icon"></span>

        </div>

      </header>
    </>
  );
}

export default Navbar;