"use client";

import { useState } from "react";
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
            Phone Number
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
          <p className="text-xs text-gray-400 mt-1">
            We&apos;ll text you if there are any changes to your lesson.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-turquoise hover:bg-turquoise-dark text-white font-bold py-3 rounded-lg text-lg transition-colors disabled:opacity-50"
        >
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}
