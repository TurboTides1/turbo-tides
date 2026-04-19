import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-32 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-heading font-bold text-turquoise mb-4">404</h1>
        <h2 className="text-2xl font-heading font-bold text-navy mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
