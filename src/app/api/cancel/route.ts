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
  const { instructor, eventId, clientName, clientPhone, date, time } = body;

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

    // Send cancellation SMS if we have the client's phone
    if (clientPhone && clientName && date && time) {
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
