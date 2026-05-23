import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll position to the top of the page on every route change.
 *
 * React Router does NOT reset scroll position by default — when navigating
 * between pages, the browser stays at whatever scroll position the user was
 * at on the previous page. On mobile especially, this means clicking a menu
 * link from mid-page lands you in the middle of the next page.
 *
 * Drop this once inside the root layout (AppShell) and every route change
 * will scroll to top automatically.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
