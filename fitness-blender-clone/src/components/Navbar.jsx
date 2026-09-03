import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const { language, changeLanguage, t } = useLanguage();

  const [languageOpen, setLanguageOpen] = useState(false);

  const languages = [
    {
      code: "en",
      label: "English",
    },
    {
      code: "es",
      label: "Español",
    },
    {
      code: "de",
      label: "Deutsch",
    },
  ];

  return (
    <header className="navbar">

      {/* Logo */}
      <a href="/" className="navbar-logo">

        <div className="logo-symbol">
          <span></span>
        </div>

        <div className="logo-text">
          <strong>fitness</strong>
          <span>BLENDER</span>
        </div>

      </a>


      {/* Navigation */}
      <nav className="navbar-links">

        <span className="nav-item">
          {t.nav.workouts}
          <i className="chevron"></i>
        </span>

        <span className="nav-item">
          {t.nav.programs}
          <i className="chevron"></i>
        </span>

        <span className="nav-item">
          {t.nav.healthyLiving}
          <i className="chevron"></i>
        </span>

        <span className="nav-item">
          {t.nav.community}
          <i className="chevron"></i>
        </span>

        <span className="nav-item">
          {t.nav.about}
          <i className="chevron"></i>
        </span>

        <span className="nav-item">
          {t.nav.store}
        </span>

        <span className="nav-item membership">
          {t.nav.membership}
        </span>

      </nav>


      {/* Right side */}
      <div className="navbar-actions">

        <div className="account-info">
          <small>{t.nav.signIn}</small>

          <strong>
            {t.nav.myFitness}
            <i className="chevron"></i>
          </strong>
        </div>


        {/* Language selector */}
        <div className="language-selector">

          <button
            className="language-button"
            onClick={() => setLanguageOpen(!languageOpen)}
          >
            {language.toUpperCase()}
            <i className="chevron"></i>
          </button>


          {languageOpen && (
            <div className="language-menu">

              {languages.map((item) => (
                <button
                  key={item.code}
                  className={
                    language === item.code
                      ? "language-option active"
                      : "language-option"
                  }
                  onClick={() => {
                    changeLanguage(item.code);
                    setLanguageOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}

            </div>
          )}

        </div>


        <span className="search-icon"></span>

        <span className="bag-icon"></span>

      </div>

    </header>
  );
}

export default Navbar;