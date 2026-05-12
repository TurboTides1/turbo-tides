import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteEvent } from "@/lib/google-calendar";
import { sendCancellationNotice } from "@/lib/twilio";
import { getInstructor } from "@/lib/instructors";

/**
 * POST /api/cancel
 * Body: { instructor, eventId, clientName, clientPhone, date, time }
 *
 * Admin-only. Deletes the calendar event and sends a cancellation SMS.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { instructor, eventId, clientName, clientPhone, date, time, smsConsent } = body;

  if (!instructor || !eventId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!getInstructor(instructor)) {
    return NextResponse.json(
      { error: "Invalid instructor" },
      { status: 400 }
    );
  }

  try {
    // Delete the calendar event
    await deleteEvent(instructor, eventId);

    // Only send cancellation SMS if the client opted in at booking time.
    // Carrier rules require us to honor the consent state recorded with the
    // booking - we can't text customers who didn't opt in.
    if (smsConsent === true && clientPhone && clientName && date && time) {
      const inst = getInstructor(instructor)!;
      await sendCancellationNotice(
        clientPhone,
        clientName,
        inst.name,
        date,
        time
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
