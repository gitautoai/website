interface HamburgerMenuProps {
  setIsNavOpen: (prev: boolean) => void;
  isNavOpen: boolean;
}

export default function HamburgerMenu({
  setIsNavOpen,
  isNavOpen,
}: HamburgerMenuProps) {
  return (
    <div
      onClick={() => setIsNavOpen(!isNavOpen)}
      className={`nav-icon4 mr-5 z-[1500] ${isNavOpen ? "navOpen" : ""}`}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
