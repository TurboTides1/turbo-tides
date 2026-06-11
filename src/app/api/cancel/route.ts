import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteEvent } from "@/lib/google-calendar";
import { getInstructor } from "@/lib/instructors";

/**
 * POST /api/cancel
 * Body: { instructor, eventId }
 *
 * Admin-only. Deletes the calendar event. Notifying the client is handled
 * manually by the instructor (e.g., a personal phone call or text).
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { instructor, eventId } = body;

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
    await deleteEvent(instructor, eventId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
