"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InstructorPicker from "@/components/booking/InstructorPicker";
import DatePicker from "@/components/booking/DatePicker";
import SlotGrid from "@/components/booking/SlotGrid";
import BookingForm from "@/components/booking/BookingForm";

type Step = "instructor" | "date" | "slot" | "info";

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("instructor");
  const [instructor, setInstructor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleInstructorSelect(slug: string) {
    setInstructor(slug);
    setDate("");
    setTime("");
    setStep("date");
  }

  function handleDateSelect(dateStr: string) {
    setDate(dateStr);
    setTime("");
    setStep("slot");
  }

  function handleSlotSelect(start: string, end: string) {
    setTime(start);
    setEndTime(end);
    setStep("info");
  }

  function handleBack() {
    if (step === "date") setStep("instructor");
    else if (step === "slot") setStep("date");
    else if (step === "info") setStep("slot");
  }

  async function handleBooking(name: string, phone: string) {
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instructor, date, time, name, phone }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    // Navigate to confirmation with booking details
    const params = new URLSearchParams({
      instructor: data.booking.instructor,
      date: data.booking.date,
      time: data.booking.time,
      endTime: data.booking.endTime,
      name: data.booking.name,
    });
    router.push(`/book/confirmation?${params.toString()}`);
  }

  const stepNumber =
    step === "instructor" ? 1 : step === "date" ? 2 : step === "slot" ? 3 : 4;

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-navy text-center mb-2">
          Book a Lesson
        </h1>
        <p className="text-gray-500 text-center mb-10">
          $25 per 20-minute private lesson
        </p>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  n <= stepNumber
                    ? "bg-turquoise text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {n}
              </div>
              {n < 4 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 ${
                    n < stepNumber ? "bg-turquoise" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Back button */}
        {step !== "instructor" && (
          <button
            onClick={handleBack}
            className="text-turquoise-dark hover:text-turquoise font-medium mb-6 inline-flex items-center gap-1 transition-colors"
          >
            &larr; Back
          </button>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Steps */}
        {step === "instructor" && (
          <InstructorPicker onSelect={handleInstructorSelect} />
        )}

        {step === "date" && (
          <DatePicker instructor={instructor} onSelect={handleDateSelect} />
        )}

        {step === "slot" && (
          <SlotGrid
            instructor={instructor}
            date={date}
            onSelect={handleSlotSelect}
          />
        )}

        {step === "info" && (
          <BookingForm
            instructor={instructor}
            date={date}
            time={time}
            endTime={endTime}
            submitting={submitting}
            onSubmit={handleBooking}
          />
        )}
      </div>
    </div>
  );
}
