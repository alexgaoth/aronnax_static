"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-grv-hard flex items-center justify-center">
      <div className="space-y-6 px-6 max-w-sm">
        <span className="section-label">System Error</span>
        <h2 className="font-display font-bold text-3xl text-grv-fg mt-4">
          Something went wrong
        </h2>
        <p className="text-grv-fg3 text-sm leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 border border-grv-b text-grv-fg2 text-xs font-mono tracking-widest uppercase hover:border-grv-aqua hover:text-grv-fg transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
