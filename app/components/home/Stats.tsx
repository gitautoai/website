"use client";

import { useEffect, useState } from "react";
import { getHomeStats, HomeStats } from "@/app/actions/supabase/usage/get-home-stats";

const FALLBACK: HomeStats = {
  totalPrsCreated: 2100,
  testPassRate: 99.5,
  mergeRate: 94.9,
};

const roundDown = (n: number) => {
  if (n >= 10000) return (Math.floor(n / 1000) * 1000).toLocaleString();
  if (n >= 1000) return (Math.floor(n / 100) * 100).toLocaleString();
  return (Math.floor(n / 10) * 10).toLocaleString();
};

export default function Stats() {
  const [stats, setStats] = useState<HomeStats>(FALLBACK);

  useEffect(() => {
    getHomeStats()
      .then(setStats)
      .catch(() => setStats(FALLBACK));
  }, []);

  return (
    <section id="stats" className="w-full py-12" aria-label="Stats section">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">Proven Results</h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
        GitAuto PRs pass tests and get merged
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
        <div className="text-center">
          <p className="text-4xl md:text-5xl font-bold text-pink-600">
            {roundDown(stats.totalPrsCreated)}+
          </p>
          <p className="text-gray-600 mt-1">PRs created</p>
        </div>
        <div className="text-center">
          <p className="text-4xl md:text-5xl font-bold text-pink-600">
            {stats.testPassRate.toFixed(1)}%
          </p>
          <p className="text-gray-600 mt-1">Test pass rate</p>
        </div>
        <div className="text-center">
          <p className="text-4xl md:text-5xl font-bold text-pink-600">
            {stats.mergeRate.toFixed(1)}%
          </p>
          <p className="text-gray-600 mt-1">Merge rate</p>
        </div>
      </div>
    </section>
  );
}
