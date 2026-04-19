"use client";

import { useState, useEffect, useCallback } from "react";
import { instructors } from "@/lib/instructors";
import type { AvailabilityWindow } from "@/lib/db/schema";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityPage() {
  const [activeTab, setActiveTab] = useState(instructors[0].slug);
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [type, setType] = useState<"recurring" | "one-off">("recurring");
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
  const [specificDate, setSpecificDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveUntil, setEffectiveUntil] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchWindows = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/availability?instructor=${activeTab}`);
    const data = await res.json();
    setWindows(data.windows ?? []);
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchWindows();
  }, [fetchWindows]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instructorSlug: activeTab,
        type,
        dayOfWeek: type === "recurring" ? dayOfWeek : null,
        specificDate: type === "one-off" ? specificDate : null,
        startTime,
        endTime,
        effectiveFrom,
        effectiveUntil,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create availability window");
      return;
    }

    fetchWindows();
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this availability window?")) return;

    await fetch(`/api/availability?id=${id}`, { method: "DELETE" });
    fetchWindows();
  }

  const recurring = windows.filter((w) => w.dayOfWeek !== null);
  const oneOff = windows.filter((w) => w.specificDate !== null);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-navy mb-6">Manage Availability</h1>

      {/* Instructor tabs */}
      <div className="flex gap-2 mb-6">
        {instructors.map((inst) => (
          <button
            key={inst.slug}
            onClick={() => setActiveTab(inst.slug)}
            className={`px-5 py-2 rounded-lg font-medium transition-colors ${
              activeTab === inst.slug
                ? "bg-turquoise text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {inst.name}
          </button>
        ))}
      </div>

      {/* Add availability form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-heading font-semibold text-navy mb-4">
          Add Availability Window
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={type === "recurring"}
                onChange={() => setType("recurring")}
                className="accent-turquoise"
              />
              <span className="text-sm font-medium">Recurring (weekly)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={type === "one-off"}
                onChange={() => setType("one-off")}
                className="accent-turquoise"
              />
              <span className="text-sm font-medium">One-time date</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {type === "recurring" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                >
                  {DAYS.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  required={type === "one-off"}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
              />
            </div>
          </div>

          {type === "recurring" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective From <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Until <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="date"
                  value={effectiveUntil}
                  onChange={(e) => setEffectiveUntil(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise/50"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Availability"}
          </button>
        </form>
      </div>

      {/* Existing windows */}
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Recurring */}
          <div className="mb-8">
            <h2 className="text-lg font-heading font-semibold text-navy mb-3">
              Recurring Weekly Schedule
            </h2>
            {recurring.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-gray-500">
                No recurring availability set.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-3 text-sm font-medium text-gray-500">Day</th>
                      <th className="px-5 py-3 text-sm font-medium text-gray-500">Time</th>
                      <th className="px-5 py-3 text-sm font-medium text-gray-500">Effective</th>
                      <th className="px-5 py-3 text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recurring.map((w) => (
                      <tr key={w.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-sm font-medium">
                          {DAYS[w.dayOfWeek!]}
                        </td>
                        <td className="px-5 py-3 text-sm">
                          {w.startTime} &ndash; {w.endTime}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {w.effectiveFrom || "Start"} &ndash; {w.effectiveUntil || "Ongoing"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDelete(w.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* One-off */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-navy mb-3">
              One-Time Availability
            </h2>
            {oneOff.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-gray-500">
                No one-time availability set.
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="px-5 py-3 text-sm font-medium text-gray-500">Time</th>
                      <th className="px-5 py-3 text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {oneOff.map((w) => (
                      <tr key={w.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-sm font-medium">{w.specificDate}</td>
                        <td className="px-5 py-3 text-sm">
                          {w.startTime} &ndash; {w.endTime}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDelete(w.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
