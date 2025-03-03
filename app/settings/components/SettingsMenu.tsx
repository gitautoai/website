"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { menuItems } from "../constants/menuItems";

export default function SettingsMenu({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="p-4">
      {/* GitAuto Logo */}
      <div className="mt-4 mb-4 md:mb-8 ml-4 flex justify-start">
        <Link href="/">
          <Image src="/full.png" alt="GitAuto Logo" width={140} height={32} priority />
        </Link>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className={`block w-full text-left p-3 rounded-lg transition-colors ${
                pathname === item.href ? "bg-pink-50 text-pink-700" : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium">{item.label}</div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
