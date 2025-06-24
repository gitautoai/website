"use client";

import { useCallback } from "react";
import { STRUCTURED_RULES_CONFIG, StructuredRules } from "./config/structured-rules";

type StructuredRulesSectionProps = {
  structuredRules: StructuredRules;
  onStructuredRulesChange: (
    key: keyof StructuredRules,
    value: boolean | string,
    shouldAutoSave?: boolean
  ) => void;
  disabled?: boolean;
};

export default function StructuredRulesSection({
  structuredRules,
  onStructuredRulesChange,
  disabled = false,
}: StructuredRulesSectionProps) {
  const handleBooleanToggle = useCallback(
    (key: keyof StructuredRules) => {
      const currentValue = structuredRules[key] as boolean;
      onStructuredRulesChange(key, !currentValue, true);
    },
    [structuredRules, onStructuredRulesChange]
  );

  const handleSelectChange = useCallback(
    (key: keyof StructuredRules, value: string) => {
      onStructuredRulesChange(key, value, true);
    },
    [onStructuredRulesChange]
  );

  const handleTextChange = useCallback(
    (key: keyof StructuredRules, value: string) => {
      onStructuredRulesChange(key, value, false);
    },
    [onStructuredRulesChange]
  );

  const renderRule = (rule: {
    key: keyof StructuredRules;
    label: string;
    description?: string;
    type: "boolean" | "select" | "text";
    options?: readonly string[];
    examples?: Record<string, string>;
    placeholder?: string;
    dependsOn?: keyof StructuredRules;
    dependsOnValue?: string;
  }) => {
    // Check if this rule should be shown based on dependencies
    if (rule.dependsOn && rule.dependsOnValue) {
      const dependentValue = structuredRules[rule.dependsOn];
      if (dependentValue !== rule.dependsOnValue) {
        return null;
      }
    }

    if (rule.type === "boolean") {
      const isChecked = structuredRules[rule.key] as boolean;
      return (
        <div key={rule.key} className="py-4 px-6 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="flex items-start gap-4">
            {/* Toggle button */}
            <button
              type="button"
              onClick={() => handleBooleanToggle(rule.key)}
              disabled={disabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                isChecked ? "bg-pink-600" : "bg-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isChecked ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            {/* Rule label and description */}
            <div className="flex-1">
              <label className="text-base text-gray-900 cursor-pointer font-medium block mb-0">
                {rule.label}
              </label>
              {rule.description && <p className="text-sm text-gray-600 mb-2">{rule.description}</p>}
              {rule.examples && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                  {Object.entries(rule.examples).map(([key, example]) => (
                    <div key={key} className="mb-1 last:mb-0">
                      <span className="font-medium">{key}:</span>{" "}
                      <code className="bg-white px-1 py-0.5 rounded text-xs">{example}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (rule.type === "select" && rule.options) {
      const currentValue = structuredRules[rule.key] as string;
      return (
        <div key={rule.key} className="py-4 px-6 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-base font-medium text-gray-900 block mb-0">{rule.label}</label>
              {rule.description && <p className="text-sm text-gray-600 mb-2">{rule.description}</p>}
            </div>

            {/* Select options */}
            <div className="flex flex-wrap gap-2">
              {rule.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectChange(rule.key, option)}
                  disabled={disabled}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all ${
                    currentValue === option
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Examples - show only for selected option */}
            {rule.examples && rule.examples[currentValue] && (
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border-l-4 border-gray-400">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-700 pt-1">Example:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs text-gray-800 flex-1">
                    {rule.examples[currentValue]}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (rule.type === "text") {
      const currentValue = structuredRules[rule.key] as string;
      return (
        <div key={rule.key} className="py-4 px-6 hover:bg-purple-50 rounded-lg transition-colors">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-base font-medium text-gray-900 block mb-0">{rule.label}</label>
              {rule.description && <p className="text-sm text-gray-600 mb-2">{rule.description}</p>}
            </div>

            {/* Text input */}
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleTextChange(rule.key, e.target.value)}
              placeholder={rule.placeholder}
              disabled={disabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent ${
                disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mt-8 space-y-6">
      {Object.entries(STRUCTURED_RULES_CONFIG).map(([sectionKey, section]) => (
        <div key={sectionKey} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 text-left my-0">{section.title}</h2>
            <p className="text-gray-600 text-base mt-1">{section.description}</p>
          </div>
          <div className="bg-white">{section.rules.map(renderRule)}</div>
        </div>
      ))}
    </div>
  );
}
