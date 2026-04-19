import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listEventsRange, parseClientInfo } from "@/lib/google-calendar";
import { instructors } from "@/lib/instructors";
import { format, addDays } from "date-fns";

/**
 * GET /api/schedule
 * Admin-only. Returns upcoming 14 days of swim lessons across both instructors.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const twoWeeksOut = format(addDays(new Date(), 14), "yyyy-MM-dd");

  const allLessons = [];

  for (const inst of instructors) {
    const events = await listEventsRange(inst.slug, today, twoWeeksOut);

    for (const event of events) {
      if (!event.start?.dateTime) continue;
      if (!event.summary?.toLowerCase().includes("swim lesson")) continue;

      const { name, phone } = parseClientInfo(event.description);

      allLessons.push({
        id: event.id ?? "",
        instructorSlug: inst.slug,
        instructorName: inst.name,
        summary: event.summary,
        start: event.start.dateTime,
        end: event.end?.dateTime ?? "",
        clientName: name,
        clientPhone: phone,
      });
    }
  }

  // Sort by start time
  allLessons.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return NextResponse.json({ lessons: allLessons });
}
