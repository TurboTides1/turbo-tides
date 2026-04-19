import { NextRequest, NextResponse } from "next/server";
import { getInstructor } from "@/lib/instructors";
import { getWindowsForDate } from "@/lib/availability";
import { getAvailableSlots } from "@/lib/slots";
import { createEvent } from "@/lib/google-calendar";
import { sendBookingConfirmation } from "@/lib/twilio";
import { addMinutes, format, parse } from "date-fns";

/**
 * POST /api/book
 * Body: { instructor, date, time, name, phone }
 *
 * Validates the slot, re-checks availability, creates a Google Calendar event.
 * SMS confirmation will be added in Milestone 6.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { instructor, date, time, name, phone } = body;

  // Validate required fields
  if (!instructor || !date || !time || !name || !phone) {
    return NextResponse.json(
      { error: "All fields are required" },
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
      { error: "Invalid date format" },
      { status: 400 }
    );
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json(
      { error: "Invalid time format" },
      { status: 400 }
    );
  }

  // Re-check availability to prevent double-booking
  const windows = await getWindowsForDate(instructor, date);
  if (windows.length === 0) {
    return NextResponse.json(
      { error: "No availability on this date" },
      { status: 409 }
    );
  }

  const slots = await getAvailableSlots(instructor, date, windows);
  const slot = slots.find((s) => s.start === time && s.available);

  if (!slot) {
    return NextResponse.json(
      { error: "This time slot is no longer available. Please choose another." },
      { status: 409 }
    );
  }

  // Build start/end datetimes
  const startDT = `${date}T${time}:00`;
  const baseDate = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
  const endDT = format(addMinutes(baseDate, 20), "yyyy-MM-dd'T'HH:mm:ss");

  const instructorData = getInstructor(instructor)!;

  try {
    const event = await createEvent(
      instructor,
      `Swim Lesson - ${name}`,
      `Client: ${name}\nPhone: ${phone}`,
      startDT,
      endDT
    );

    // Send SMS confirmation (skips gracefully if Twilio not configured)
    await sendBookingConfirmation(phone, name, instructorData.name, date, time);

    return NextResponse.json({
      success: true,
      booking: {
        eventId: event.id,
        instructor: instructorData.name,
        date,
        time,
        endTime: slot.end,
        name,
        phone,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
