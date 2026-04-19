"use client";

import { useEffect, useState } from "react";
import { getInstructor } from "@/lib/instructors";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Props {
  instructor: string;
  date: string;
  onSelect: (start: string, end: string) => void;
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function SlotGrid({ instructor, date, onSelect }: Props) {
  const inst = getInstructor(instructor);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/slots?instructor=${instructor}&date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load available times.");
        setLoading(false);
      });
  }, [instructor, date]);

  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  const availableSlots = slots.filter((s) => s.available);

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-navy mb-1 text-center">
        Pick a Time
      </h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        {inst?.name} &mdash; {formattedDate}
      </p>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading available times...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : availableSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No available times on this date.</p>
          <p className="text-sm text-gray-400">Try a different date or instructor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableSlots.map((slot) => (
            <button
              key={slot.start}
              onClick={() => onSelect(slot.start, slot.end)}
              className="bg-white border-2 border-gray-100 hover:border-turquoise rounded-xl py-3 px-4 text-center transition-colors"
            >
              <div className="font-semibold text-navy">
                {formatTime12(slot.start)}
              </div>
              <div className="text-xs text-gray-400">20 min</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
