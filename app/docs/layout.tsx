"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RELATIVE_URLS } from "@/config/urls";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION, label: "Installation" },
      {
        href: RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
        label: "GitHub Issues Checkbox Trigger",
      },
      {
        href: RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
        label: "GitHub Issues Label Trigger",
      },
      { href: RELATIVE_URLS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER, label: "Dashboard Trigger" },
      { href: RELATIVE_URLS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES, label: "Parent Issue Rules" },
    ],
  },
  {
    title: "Coverage Dashboard",
    items: [
      { href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW, label: "Overview" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT, label: "JavaScript Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.PYTHON, label: "Python Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.FLUTTER, label: "Flutter Testing" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-64px)] pt-28">
      <div className="flex flex-col md:flex-row md:justify-around gap-8 lg:gap-12 h-full">
        {/* Main Content */}
        <main className="flex-1 max-w-3xl">{children}</main>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-56 relative">
          <div className="sticky top-28">
            <nav className="space-y-6">
              {sidebarItems.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-medium text-gray-900 text-sm mb-2">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block py-1 px-2 rounded-md text-sm transition-colors ${
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
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <select
            value={pathname}
            onChange={(e) => (window.location.href = e.target.value)}
            className="w-full p-2 text-sm border rounded-md"
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
