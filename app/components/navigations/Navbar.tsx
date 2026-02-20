"use client";
// Third Party
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Local imports
import AuthControls from "@/app/components/AuthControls";
import MobileDrawer from "@/app/components/navigations/MobileMenu";
import { INTERNAL_LINKS } from "@/config/internal-links";
import { RELATIVE_URLS } from "@/config/urls";
import HamburgerMenu from "./Hamburger";

export default function Navbar() {
  const pathname = usePathname();
  const hideNavbar = pathname?.startsWith("/settings") || pathname?.startsWith("/dashboard");

  const { data: session, status } = useSession();

  const [isNavOpen, setIsNavOpen] = useState(false);

  if (hideNavbar) return null;
  return (
    <div className="absolute top-4 left-0 flex flex-col w-full justify-center items-center font-helvetica sm:text-md xl:text-lg bg-white px-0 md:px-24 z-50">
      <div className="flex flex-col w-full">
        <nav className="flex text-lg justify-center items-center">
          <Link href={RELATIVE_URLS.INDEX} className="mr-auto ml-5">
            <Image src="/logo.png" width={150} height={78} loading="lazy" alt="GitAuto Logo" />
          </Link>
          <ol className="hidden md:flex items-center justify-center gap-5">
            {INTERNAL_LINKS.filter((link) => link.showInHeader).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap transition duration-[325ms] link"
                >
                  {link.text}
                </Link>
              </li>
            ))}
            <AuthControls />
          </ol>
          <HamburgerMenu
            setIsNavOpen={setIsNavOpen}
            isNavOpen={isNavOpen}
            session={session}
            status={status}
          />
          <MobileDrawer setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
        </nav>
      </div>
    </div>
  );
}
