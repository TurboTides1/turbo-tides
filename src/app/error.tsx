"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-32 px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-heading font-bold text-navy mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
