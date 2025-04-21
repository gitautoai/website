"use client";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState(code);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initPrism = async () => {
      const Prism = (await import("prismjs")).default;
      await import("prismjs/components/prism-bash");
      await import("prismjs/components/prism-javascript");
      await import("prismjs/components/prism-json");
      await import("prismjs/components/prism-typescript");
      await import("prismjs/components/prism-yaml");
      await import("prismjs/themes/prism-tomorrow.css");

      const highlightedCode = Prism.highlight(code, Prism.languages[language], language);
      setHighlighted(highlightedCode);
    };

    initPrism();
  }, [code, language]);

  if (!mounted) {
    return (
      <div className="relative font-mono text-[15px] leading-relaxed">
        {filename && (
          <div className="bg-[#1e1e1e] text-gray-400 px-4 py-2 rounded-t-lg border-b border-gray-700">
            {filename}
          </div>
        )}
        <div className="bg-[#1e1e1e] rounded-b-lg overflow-hidden">
          <pre className="p-4 m-0 overflow-x-auto text-zinc-200">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative font-mono text-[15px] leading-relaxed">
      {filename && (
        <div className="bg-[#1e1e1e] text-gray-400 px-4 py-2 rounded-t-lg border-b border-gray-700">
          {filename}
        </div>
      )}
      <div className="bg-[#1e1e1e] rounded-b-lg overflow-hidden">
        <div className="relative group">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute right-2 top-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="p-4 m-0 overflow-x-auto">
            <code className="text-zinc-200" dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
