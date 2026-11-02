import { useEffect, useRef, useState } from "react";

const links = [
  { id: "explorar", number: "01", label: "Explore" },
  { id: "conceptos", number: "02", label: "The essentials" },
  { id: "tipos", number: "03", label: "Types of RNA" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 640px)").matches,
  );
  const menuButton = useRef(null);
  const navigation = useRef(null);
  const firstLink = useRef(null);
  const pendingFocus = useRef(null);

  useEffect(() => {
    const mobileScreen = window.matchMedia("(max-width: 640px)");
    function handleResize() {
      const focusWasInMenu = navigation.current.contains(
        document.activeElement,
      );
      const focusWasOnButton = document.activeElement === menuButton.current;
      pendingFocus.current =
        mobileScreen.matches && focusWasInMenu
          ? menuButton.current
          : !mobileScreen.matches && focusWasOnButton
            ? firstLink.current
            : null;
      setIsMobile(mobileScreen.matches);
      setMenuOpen(false);
    }
    mobileScreen.addEventListener("change", handleResize);
    return () => mobileScreen.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    pendingFocus.current?.focus();
    pendingFocus.current = null;
  }, [isMobile]);

  function closeMenu() {
    if (window.matchMedia("(max-width: 640px)").matches) {
      setMenuOpen(false);
      menuButton.current.focus({ preventScroll: true });
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButton.current.focus();
    }
  }

  return (
    <header className="site-header" onKeyDown={handleKeyDown}>
      <nav className="site-nav page-width" aria-label="Main navigation">
        <a className="brand" href="#inicio" aria-label="RNA in 3D, home">
          <svg viewBox="0 0 32 40" width="28" height="36" aria-hidden="true">
            <path d="M8 37V15a8 8 0 0 1 16 0v22M8 23h16M8 29h16M8 35h16" />
          </svg>
          <span>
            RNA<span className="brand-subtitle">IN THREE DIMENSIONS</span>
          </span>
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          hidden={!isMobile}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        <ul
          ref={navigation}
          className="nav-links"
          hidden={isMobile && !menuOpen}
          id="nav-links"
        >
          {links.map((link) => (
            <li key={link.id}>
              <a
                ref={link.id === "explorar" ? firstLink : null}
                href={`#${link.id}`}
                onClick={closeMenu}
              >
                <span>{link.number}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
