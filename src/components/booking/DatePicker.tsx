"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, startOfDay } from "date-fns";
import { getInstructor } from "@/lib/instructors";

interface Props {
  instructor: string;
  onSelect: (dateStr: string) => void;
}

export default function DatePicker({ instructor, onSelect }: Props) {
  const inst = getInstructor(instructor);
  const today = startOfDay(new Date());

  function handleSelect(day: Date | undefined) {
    if (day) {
      onSelect(format(day, "yyyy-MM-dd"));
    }
  }

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-navy mb-1 text-center">
        Pick a Date
      </h2>
      <p className="text-gray-500 text-center mb-6 text-sm">
        Booking with {inst?.name}
      </p>
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 inline-block">
          <DayPicker
            mode="single"
            onSelect={handleSelect}
            disabled={{ before: today }}
            modifiersClassNames={{
              selected: "!bg-turquoise !text-white",
              today: "!font-bold !text-turquoise-dark",
            }}
          />
        </div>
      </div>
    </div>
  );
}
