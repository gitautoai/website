import { Session } from "next-auth";
import ProfileIcon from "./ProfileIcon";

interface HamburgerMenuProps {
  setIsNavOpen: (prev: boolean) => void;
  isNavOpen: boolean;
  session: Session | null;
  status: string;
}

export default function HamburgerMenu({
  setIsNavOpen,
  isNavOpen,
  session,
  status,
}: HamburgerMenuProps) {
  return (
    <div
      onClick={() => setIsNavOpen(!isNavOpen)}
      className="mr-5 z-[1500] sm:hidden"
    >
      <div
        className={`nav-icon4 ${
          status === "authenticated" && !isNavOpen && "hidden"
        } ${isNavOpen ? "navOpen" : ""}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      {status === "authenticated" && !isNavOpen && (
        <div>
          <ProfileIcon session={session} />
        </div>
      )}
    </div>
  );
}
