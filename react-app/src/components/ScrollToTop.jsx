import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

// Resets scroll on navigation. A hash is honoured rather than overridden, so a
// link back to a section of the home page (e.g. /#projects) lands on that
// section instead of the top of the page.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    posthog.capture('$pageview');
  }, [pathname, hash]);

  return null;
}
