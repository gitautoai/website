import Image from "next/image";
import Link from "next/link";
import { menuItems } from "../constants/menuItems";

interface SettingsMenuProps {
  onItemClick?: () => void;
  currentPath?: string;
}

export default function SettingsMenu({ onItemClick, currentPath }: SettingsMenuProps) {
  return (
    <nav className="p-4">
      {/* GitAuto Logo */}
      <div className="mt-4 mb-4 md:mb-8 ml-4 flex justify-start">
        <Link href="/">
          <Image src="/logo.png" alt="GitAuto Logo" width={140} height={32} priority />
        </Link>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.isHeader ? (
              <div className="text-sm font-semibold text-gray-500 px-3 py-2 mt-4">{item.label}</div>
            ) : (
              <Link
                href={item.href}
                onClick={onItemClick}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentPath === item.href ? "bg-pink-50 text-pink-700" : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{item.label}</div>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
