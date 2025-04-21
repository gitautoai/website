"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const sidebarItems = [
  {
    title: "Coverage Dashboard",
    items: [
      { href: "/docs/coverage", label: "Overview" },
      { href: "/docs/coverage/javascript", label: "JavaScript Testing" },
      { href: "/docs/coverage/python", label: "Python Testing" },
      { href: "/docs/coverage/flutter", label: "Flutter Testing" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] pt-32 px-4 lg:px-12">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 h-full">
        {/* Main Content */}
        <main className="flex-1 max-w-3xl">{children}</main>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64">
          <nav className="space-y-8">
            {sidebarItems.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block py-1 px-2 rounded-md transition-colors ${
                          pathname === item.href
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:text-pink-600"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <select
            value={pathname}
            onChange={(e) => (window.location.href = e.target.value)}
            className="w-full p-3 text-sm border rounded-md"
          >
            {sidebarItems.map((section) =>
              section.items.map((item) => (
                <option key={item.href} value={item.href}>
                  {section.title} - {item.label}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
