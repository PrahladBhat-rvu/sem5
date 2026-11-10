import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Browser Back / Forward
    if (navigationType === "POP") {
      return;
    }

    // Normal link navigation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search, navigationType]);

  return null;
}

export default ScrollToTop;