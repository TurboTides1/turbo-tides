import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";
import { getInstructor } from "@/lib/instructors";
import { getWindowsForDate } from "@/lib/availability";

/**
 * GET /api/slots?instructor=kayla&date=2026-06-15
 *
 * Returns available time slots for the given instructor and date.
 * Pulls availability windows from the database and checks Google Calendar for conflicts.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const instructor = searchParams.get("instructor");
  const date = searchParams.get("date");

  if (!instructor || !date) {
    return NextResponse.json(
      { error: "Missing instructor or date parameter" },
      { status: 400 }
    );
  }

  if (!getInstructor(instructor)) {
    return NextResponse.json(
      { error: "Invalid instructor" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    );
  }

  try {
    const windows = await getWindowsForDate(instructor, date);

    if (windows.length === 0) {
      return NextResponse.json({ instructor, date, slots: [] });
    }

    const slots = await getAvailableSlots(instructor, date, windows);

    return NextResponse.json({ instructor, date, slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}
