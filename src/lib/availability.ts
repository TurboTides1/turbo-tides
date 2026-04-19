import { db } from "./db";
import { availabilityWindows } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Get the availability windows that apply to a specific date for an instructor.
 * Returns matching recurring windows (by day of week) and one-off windows (by date).
 */
export async function getWindowsForDate(
  instructorSlug: string,
  dateStr: string
): Promise<{ startTime: string; endTime: string }[]> {
  const date = new Date(dateStr + "T12:00:00");
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

  const allWindows = await db
    .select()
    .from(availabilityWindows)
    .where(eq(availabilityWindows.instructorSlug, instructorSlug));

  const matched: { startTime: string; endTime: string }[] = [];

  for (const w of allWindows) {
    // One-off: exact date match
    if (w.specificDate !== null) {
      if (w.specificDate === dateStr) {
        matched.push({ startTime: w.startTime, endTime: w.endTime });
      }
      continue;
    }

    // Recurring: match day of week + check effective range
    if (w.dayOfWeek !== null && w.dayOfWeek === dayOfWeek) {
      if (w.effectiveFrom && dateStr < w.effectiveFrom) continue;
      if (w.effectiveUntil && dateStr > w.effectiveUntil) continue;
      matched.push({ startTime: w.startTime, endTime: w.endTime });
    }
  }

  return matched;
}
