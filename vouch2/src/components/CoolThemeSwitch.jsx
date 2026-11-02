import React from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * CoolThemeSwitch
 * Animated Day/Night Theme Switch based on:
 * https://framer.com/m/CoolThemeSwitch-jbUt.js@WuyuysvX5GwpMqKs8OMd
 * Features animated sun/moon transition, drifting clouds, and starry night sky.
 */
export default function CoolThemeSwitch({
  toggleSize = 10,
  scale = 1,
  sunColor = "#ECCA2F",
  moonColor = "#C4C9D1",
  containerLight = "#3D7EAE",
  containerNight = "#1D1F2C",
  shadow = true,
}) {
  const { isDark, toggleTheme } = useTheme();

  const cssVars = {
    "--toggle-size": `${toggleSize}px`,
    "--container-width": "5.625em",
    "--container-height": "2.5em",
    "--container-radius": "6.25em",
    "--container-light-bg": containerLight,
    "--container-night-bg": containerNight,
    "--circle-container-diameter": "3.375em",
    "--sun-moon-diameter": "2.125em",
    "--sun-bg": sunColor,
    "--moon-bg": moonColor,
    "--spot-color": "#959DB1",
    "--circle-container-offset":
      "calc((var(--circle-container-diameter) - var(--container-height)) / 2 * -1)",
    "--stars-color": "#fff",
    "--clouds-color": "#F3FDFF",
    "--back-clouds-color": "#AACADF",
    "--transition": ".45s cubic-bezier(0, -0.02, 0.4, 1.25)",
    "--circle-transition": ".3s cubic-bezier(0, -0.02, 0.35, 1.17)",
    fontSize: `${toggleSize}px`,
  };

  return (
    <label
      className="cool-theme-switch-wrap"
      aria-label="Toggle light and dark theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="cool-theme-switch__checkbox"
        role="switch"
        aria-checked={isDark}
      />
      <div
        className="cool-theme-switch__container"
        style={{ ...cssVars, transform: `scale(${scale})` }}
      >
        <div className="cool-theme-switch__circle-container">
          <div className="cool-theme-switch__sun-moon-container">
            <div className="cool-theme-switch__moon">
              <span className="cool-theme-switch__spot" />
              <span className="cool-theme-switch__spot" />
              <span className="cool-theme-switch__spot" />
            </div>
          </div>
        </div>
        <span className="cool-theme-switch__clouds" />
        <span className="cool-theme-switch__stars-container">
          <svg
            width="44"
            height="9"
            viewBox="0 0 44 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2.5" cy="6.5" r="1.5" fill="#fff" />
            <circle cx="8.5" cy="1.5" r="0.5" fill="#fff" />
            <circle cx="16" cy="3" r="1" fill="#fff" />
            <circle cx="22.5" cy="7.5" r="1.5" fill="#fff" />
            <circle cx="29.5" cy="3.5" r="1" fill="#fff" />
            <circle cx="36" cy="1" r="0.5" fill="#fff" />
            <circle cx="41.5" cy="6.5" r="1" fill="#fff" />
          </svg>
        </span>
      </div>
    </label>
  );
}

