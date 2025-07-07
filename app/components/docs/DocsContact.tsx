import Link from "next/link";
import { RELATIVE_URLS } from "@/config/urls";

interface DocsContactProps {
  title?: string;
  description?: string;
  callToAction?: string;
  linkText?: string;
}

export function DocsContact({
  title = "Need Help?",
  description = "Have questions or suggestions? We're here to help you get the most out of GitAuto.",
  callToAction = "Contact us",
  linkText = "with your questions or feedback!",
}: DocsContactProps) {
  return (
    <section className="mt-12">
      <div className="bg-pink-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mt-0 mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-gray-700">
          <Link
            href={RELATIVE_URLS.CONTACT}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            {callToAction}
          </Link>{" "}
          {linkText}
        </p>
      </div>
    </section>
  );
}
