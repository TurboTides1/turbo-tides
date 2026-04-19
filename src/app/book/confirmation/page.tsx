"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const instructor = searchParams.get("instructor") ?? "";
  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "";
  const endTime = searchParams.get("endTime") ?? "";
  const name = searchParams.get("name") ?? "";

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        {/* Check icon */}
        <div className="w-20 h-20 bg-turquoise/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-heading font-bold text-navy mb-2">
          You&apos;re Booked!
        </h1>
        <p className="text-gray-500 mb-8">
          Thanks, {name}! Your swim lesson is confirmed.
        </p>

        {/* Booking details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-left mb-8">
          <h2 className="font-heading font-semibold text-navy mb-4">Lesson Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Instructor</dt>
              <dd className="font-medium text-navy">{instructor}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="font-medium text-navy">{formattedDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Time</dt>
              <dd className="font-medium text-navy">
                {time && formatTime12(time)} &ndash; {endTime && formatTime12(endTime)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Location</dt>
              <dd className="font-medium text-navy">Glenview Swim Club</dd>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <dt className="text-gray-500">Payment Due</dt>
              <dd className="font-bold text-navy text-lg">$25</dd>
            </div>
          </dl>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          Please bring <strong>$25</strong> (cash, Venmo, or Zelle) to your lesson. Payment is collected at the pool.
        </div>

        <Link
          href="/"
          className="inline-block bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-gray-500">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
