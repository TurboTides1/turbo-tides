"use client";

import { useState, useEffect, useCallback } from "react";
import { instructors } from "@/lib/instructors";

interface Lesson {
  id: string;
  instructorSlug: string;
  instructorName: string;
  summary: string;
  start: string;
  end: string;
  clientName: string;
  clientPhone: string;
}

function formatTime12(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function SchedulePage() {
  const [filter, setFilter] = useState("all");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/schedule");
    const data = await res.json();
    setLessons(data.lessons ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  async function handleCancel(lesson: Lesson) {
    if (
      !confirm(
        `Cancel ${lesson.clientName}'s lesson on ${formatDate(lesson.start)} at ${formatTime12(lesson.start)}?\n\nThis will delete the calendar event and notify the client via SMS.`
      )
    )
      return;

    setCancelling(lesson.id);

    const startDT = new Date(lesson.start);
    const date = `${startDT.getFullYear()}-${(startDT.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startDT.getDate().toString().padStart(2, "0")}`;
    const time = `${startDT.getHours().toString().padStart(2, "0")}:${startDT
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instructor: lesson.instructorSlug,
        eventId: lesson.id,
        clientName: lesson.clientName,
        clientPhone: lesson.clientPhone,
        date,
        time,
      }),
    });

    setCancelling(null);
    fetchLessons();
  }

  const filtered =
    filter === "all"
      ? lessons
      : lessons.filter((l) => l.instructorSlug === filter);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-navy mb-6">Schedule</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-turquoise text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {instructors.map((inst) => (
          <button
            key={inst.slug}
            onClick={() => setFilter(inst.slug)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              filter === inst.slug
                ? "bg-turquoise text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {inst.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 py-8">Loading schedule...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm text-gray-500">
          No upcoming lessons in the next 14 days.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-sm font-medium text-gray-500">Instructor</th>
                <th className="px-5 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="px-5 py-3 text-sm font-medium text-gray-500">Time</th>
                <th className="px-5 py-3 text-sm font-medium text-gray-500">Client</th>
                <th className="px-5 py-3 text-sm font-medium text-gray-500">Phone</th>
                <th className="px-5 py-3 text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 text-sm font-medium">{lesson.instructorName}</td>
                  <td className="px-5 py-3 text-sm">{formatDate(lesson.start)}</td>
                  <td className="px-5 py-3 text-sm">{formatTime12(lesson.start)}</td>
                  <td className="px-5 py-3 text-sm font-medium">{lesson.clientName}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{lesson.clientPhone || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleCancel(lesson)}
                      disabled={cancelling === lesson.id}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {cancelling === lesson.id ? "Cancelling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
