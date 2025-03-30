import { useRef, useState, useEffect } from "react";
import { coverageDashboardHelp } from "@/app/settings/coverage/help-content";

interface HelpProps {
  helpKey: "coverage-dashboard";
  className?: string;
}

export default function Help({ helpKey, className = "" }: HelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const content = helpKey === "coverage-dashboard" ? coverageDashboardHelp : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!content) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
        aria-label="Help"
      >
        <span className="text-gray-600 text-sm font-medium">?</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="h-14 px-4 border-b flex justify-between items-center bg-gradient-to-r from-pink-50 to-white rounded-t-2xl">
              <h2 className="pb-3 text-xl font-semibold text-gray-800">{content.title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <p className="text-gray-600 mb-6">{content.description}</p>

              <div className="space-y-6">
                {content.steps.map((step, index) => (
                  <HelpStep
                    key={index}
                    number={index + 1}
                    title={step.title}
                    content={step.content}
                    items={step.subItems}
                    note={step.note}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface HelpStepProps {
  number: number;
  title: string;
  content: string;
  items?: string[];
  note?: string;
}

function HelpStep({ number, title, content, items, note }: HelpStepProps) {
  const renderText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/);
    return parts.map((part, index) => {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [_, linkText, url] = match;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-700"
          >
            {linkText}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 font-medium text-sm">
          {number}
        </span>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-2">{content}</p>

        {items && (
          <ul className="list-disc list-outside space-y-1 ml-5 text-gray-600">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        {note && (
          <div className="mt-2 text-sm text-pink-600 bg-pink-50 px-3 py-2 rounded-lg">
            Note: {renderText(note)}
          </div>
        )}
      </div>
    </div>
  );
}
