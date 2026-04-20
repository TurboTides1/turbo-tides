"use client";

import { useState } from "react";
import Link from "next/link";
import { getInstructor } from "@/lib/instructors";

interface Props {
  instructor: string;
  date: string;
  time: string;
  endTime: string;
  submitting: boolean;
  onSubmit: (name: string, phone: string) => void;
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function BookingForm({
  instructor,
  date,
  time,
  endTime,
  submitting,
  onSubmit,
}: Props) {
  const inst = getInstructor(instructor);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(name.trim(), phone.trim());
  }

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-navy mb-6 text-center">
        Your Information
      </h2>

      {/* Booking summary */}
      <div className="bg-turquoise/5 border border-turquoise/20 rounded-xl p-5 mb-6">
        <div className="text-sm font-medium text-turquoise-dark mb-2">Booking Summary</div>
        <div className="text-sm text-gray-700 space-y-1">
          <div><span className="font-medium">Instructor:</span> {inst?.name}</div>
          <div><span className="font-medium">Date:</span> {formattedDate}</div>
          <div><span className="font-medium">Time:</span> {formatTime12(time)} &ndash; {formatTime12(endTime)}</div>
          <div><span className="font-medium">Price:</span> $25</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="First and last name"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50 focus:border-turquoise"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50 focus:border-turquoise"
          />
        </div>

        <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <input
            id="sms-consent"
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            required
            className="mt-1 h-4 w-4 rounded border-gray-300 text-turquoise focus:ring-turquoise"
          />
          <label htmlFor="sms-consent" className="text-xs text-gray-600 leading-relaxed">
            I agree to receive text messages from Turbo Tides about my swim
            lesson bookings, including confirmations and cancellation notices.
            Message frequency is low; message and data rates may apply. Reply
            STOP to opt out. See our{" "}
            <Link href="/privacy" className="text-turquoise hover:underline" target="_blank">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !smsConsent}
          className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-bold py-3 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
