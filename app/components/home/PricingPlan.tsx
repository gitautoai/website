import Image from "next/image";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import SubscribeButton from "@/app/components/buttons/SubscribeButton";
import SpinnerIcon from "@/app/components/SpinnerIcon";
import CheckMark from "@/app/components/icons/CheckMark";

type PricingPlanProps = {
  badge?: {
    text: string;
    color: string;
  };
  recommended?: boolean;
  title: string;
  price: React.ReactNode;
  description: string;
  features: string[];
  action: {
    text?: string;
    href?: string;
    onClick?: () => void;
    isLoading?: boolean;
    target?: string;
    style: "primary" | "secondary" | "outline";
    icon?: string;
    isSubscribe?: boolean;
    billingPeriod?: string;
  };
};

export const PricingPlan = ({
  badge,
  recommended = false,
  title,
  price,
  description,
  features,
  action,
}: PricingPlanProps) => {
  const posthog = usePostHog();

  // Button styles
  const buttonStyles = {
    primary: "bg-pink-600 hover:bg-pink-700 text-white",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    outline: "bg-white border border-pink-600 text-pink-600 hover:bg-pink-50",
  };

  return (
    <div
      className={`flex flex-col p-6 bg-white border ${
        recommended ? "border-2 border-pink-600" : "border-gray-200"
      } rounded-xl ${
        recommended ? "shadow-md hover:shadow-xl" : "shadow-sm hover:shadow-lg"
      } transition-all duration-300 relative h-full transform hover:-translate-y-1 hover:scale-[1.02]`}
    >
      {/* If badge exists */}
      {badge && (
        <span
          className={`inline-block px-3 py-1 text-xs font-medium ${badge.color} rounded-full mb-3`}
        >
          {badge.text}
        </span>
      )}

      {/* Recommended badge */}
      {recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          RECOMMENDED
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <div className="mb-2">{price}</div>
        <p className="text-gray-600 mb-6 md:h-12">{description}</p>

        {/* Feature list - fill with empty div to keep height */}
        <ul className="space-y-2 mb-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-1">
              <CheckMark />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action button - fixed at bottom */}
      <div className="mt-6">
        {action.isSubscribe ? (
          <SubscribeButton
            billingPeriod={action.billingPeriod || "Monthly"}
            className="w-full px-6 py-3 font-semibold"
          />
        ) : action.href ? (
          <Link
            href={action.href}
            target={action.target}
            onClick={() => {
              if (action.onClick) action.onClick();
              posthog.capture("$click", {
                $event_type: `pricing_${
                  action.text?.toLowerCase().replace(/\s+/g, "_") || "action"
                }`,
                $current_url: window.location.href,
              });
            }}
            className={`w-full px-6 py-3 ${
              buttonStyles[action.style]
            } font-semibold rounded-lg text-center transition-colors flex items-center justify-center`}
          >
            {action.icon && (
              <Image
                src={action.icon}
                width={24}
                height={24}
                loading="lazy"
                alt=""
                className="mr-2"
              />
            )}
            {action.text}
          </Link>
        ) : (
          <button
            onClick={() => {
              if (action.onClick) action.onClick();
              posthog.capture("$click", {
                $event_type: `pricing_${
                  action.text?.toLowerCase().replace(/\s+/g, "_") || "action"
                }`,
                $current_url: window.location.href,
              });
            }}
            className={`w-full px-6 py-3 ${
              buttonStyles[action.style]
            } font-semibold rounded-lg text-center transition-colors flex items-center justify-center ${
              action.isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={action.isLoading}
          >
            {action.isLoading && <SpinnerIcon white={action.style === "primary"} />}
            {action.text}
          </button>
        )}
      </div>
    </div>
  );
};
