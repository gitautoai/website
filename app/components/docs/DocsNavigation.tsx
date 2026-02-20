import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface NavigationLink {
  href: string;
  title: string;
}

interface DocsNavigationProps {
  previousLink?: NavigationLink;
  nextLink?: NavigationLink;
}

export function DocsNavigation({ previousLink, nextLink }: DocsNavigationProps) {
  return (
    <div className="mt-12 pt-4 border-t border-gray-200">
      <div className="flex justify-between">
        {previousLink ? (
          <Link
            href={previousLink.href}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaChevronLeft className="h-5 w-5 mr-1" />
            <span>{previousLink.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextLink ? (
          <Link
            href={nextLink.href}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <span>{nextLink.title}</span>
            <FaChevronRight className="h-5 w-5 ml-1" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
