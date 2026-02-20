"use client";

import { useEffect, useState } from "react";

export type PeriodType =
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "this-year"
  | "all-time"
  | "custom";

export interface Period {
  type: PeriodType;
  label: string;
  startDate?: string;
  endDate?: string;
}

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const PREDEFINED_PERIODS: Period[] = [
  { type: "this-month", label: "This Month" },
  { type: "last-month", label: "Last Month" },
  { type: "last-3-months", label: "Last 3 Months" },
  { type: "last-6-months", label: "Last 6 Months" },
  { type: "this-year", label: "This Year" },
  { type: "all-time", label: "All Time" },
  { type: "custom", label: "Custom Range" },
];

export function calculatePeriodDates(period: Period): {
  startDate: string | null;
  endDate: string | null;
} {
  const now = new Date();

  switch (period.type) {
    case "this-month":
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return {
        startDate: thisMonthStart.toISOString(),
        endDate: nextMonthStart.toISOString(),
      };

    case "last-month":
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthStart2 = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        startDate: lastMonthStart.toISOString(),
        endDate: thisMonthStart2.toISOString(),
      };

    case "last-3-months":
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      return {
        startDate: threeMonthsAgo.toISOString(),
        endDate: new Date().toISOString(),
      };

    case "last-6-months":
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      return {
        startDate: sixMonthsAgo.toISOString(),
        endDate: new Date().toISOString(),
      };

    case "this-year":
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);
      return {
        startDate: yearStart.toISOString(),
        endDate: nextYearStart.toISOString(),
      };

    case "all-time":
      return {
        startDate: null,
        endDate: null,
      };

    case "custom":
      return {
        startDate: period.startDate || null,
        endDate: period.endDate || null,
      };

    default:
      return { startDate: null, endDate: null };
  }
}

export default function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  // Remember the last custom dates even when switching periods
  const [savedCustomDates, setSavedCustomDates] = useState<{ start: string; end: string }>({
    start:
      selectedPeriod.type === "custom" && selectedPeriod.startDate
        ? selectedPeriod.startDate.split("T")[0]
        : "",
    end:
      selectedPeriod.type === "custom" && selectedPeriod.endDate
        ? selectedPeriod.endDate.split("T")[0]
        : "",
  });
  const [customStartDate, setCustomStartDate] = useState(savedCustomDates.start);
  const [customEndDate, setCustomEndDate] = useState(savedCustomDates.end);
  const [showCustom, setShowCustom] = useState(selectedPeriod.type === "custom");

  useEffect(() => {
    if (selectedPeriod.type === "custom") {
      setShowCustom(true);
      if (selectedPeriod.startDate && selectedPeriod.endDate) {
        const start = selectedPeriod.startDate.split("T")[0];
        const end = selectedPeriod.endDate.split("T")[0];
        setCustomStartDate(start);
        setCustomEndDate(end);
        setSavedCustomDates({ start, end });
      }
    } else {
      setShowCustom(false);
    }
  }, [selectedPeriod]);

  const handlePeriodTypeChange = (type: PeriodType) => {
    if (type === "custom") {
      setShowCustom(true);
      // Restore saved custom dates
      setCustomStartDate(savedCustomDates.start);
      setCustomEndDate(savedCustomDates.end);
      // If we have saved dates, apply them immediately
      if (savedCustomDates.start && savedCustomDates.end) {
        const startDate = savedCustomDates.start + "T00:00:00.000Z";
        const endDate = savedCustomDates.end + "T23:59:59.999Z";
        onPeriodChange({
          type: "custom",
          label: "Custom Range",
          startDate,
          endDate,
        });
      }
    } else {
      setShowCustom(false);
      const period = PREDEFINED_PERIODS.find((p) => p.type === type)!;
      onPeriodChange(period);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {!showCustom && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Time Period</label>
          <select
            value={selectedPeriod.type}
            onChange={(e) => handlePeriodTypeChange(e.target.value as PeriodType)}
            className="w-[calc(50%-0.5rem)] p-2 border rounded-lg bg-white"
          >
            {PREDEFINED_PERIODS.map((period) => (
              <option key={period.type} value={period.type}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {showCustom && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Time Period</label>
            <select
              value={selectedPeriod.type}
              onChange={(e) => handlePeriodTypeChange(e.target.value as PeriodType)}
              className="w-full p-2 border rounded-lg bg-white"
            >
              {PREDEFINED_PERIODS.map((period) => (
                <option key={period.type} value={period.type}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Start Date</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => {
                const newStartDate = e.target.value;
                setCustomStartDate(newStartDate);
                if (newStartDate && customEndDate) {
                  const startDate = newStartDate + "T00:00:00.000Z";
                  const endDate = customEndDate + "T23:59:59.999Z";
                  setSavedCustomDates({ start: newStartDate, end: customEndDate });
                  onPeriodChange({
                    type: "custom",
                    label: "Custom Range",
                    startDate,
                    endDate,
                  });
                }
              }}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">End Date</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => {
                const newEndDate = e.target.value;
                setCustomEndDate(newEndDate);
                if (customStartDate && newEndDate) {
                  const startDate = customStartDate + "T00:00:00.000Z";
                  const endDate = newEndDate + "T23:59:59.999Z";
                  setSavedCustomDates({ start: customStartDate, end: newEndDate });
                  onPeriodChange({
                    type: "custom",
                    label: "Custom Range",
                    startDate,
                    endDate,
                  });
                }
              }}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
