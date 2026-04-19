import { listEvents } from "./google-calendar";
import { format, parse, addMinutes, isBefore, isEqual } from "date-fns";

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "09:20"
  available: boolean;
}

/**
 * Given an instructor and a date, generate available 20-minute time slots.
 *
 * Slot rules:
 * - Slots start at :00 and :30 (20 min lesson + 10 min buffer = 30 min cycle)
 * - Slots that overlap with existing calendar events are marked unavailable
 *
 * For now, availability windows come from the database (Milestone 4).
 * Until then, this function takes an array of availability windows as input.
 */
export async function getAvailableSlots(
  instructorSlug: string,
  dateStr: string,
  availabilityWindows: { startTime: string; endTime: string }[]
): Promise<TimeSlot[]> {
  // Get existing events from Google Calendar
  const events = await listEvents(instructorSlug, dateStr);

  // Parse booked time ranges
  const bookedRanges = events
    .filter((e) => e.start?.dateTime && e.end?.dateTime)
    .map((e) => ({
      start: new Date(e.start!.dateTime!),
      end: new Date(e.end!.dateTime!),
    }));

  // Generate all possible slots from availability windows
  const slots: TimeSlot[] = [];
  const baseDate = parse(dateStr, "yyyy-MM-dd", new Date());

  for (const window of availabilityWindows) {
    const windowStart = parse(window.startTime, "HH:mm", baseDate);
    const windowEnd = parse(window.endTime, "HH:mm", baseDate);

    let current = windowStart;

    while (true) {
      const slotEnd = addMinutes(current, 20);

      // Stop if the slot end exceeds the window
      if (!isBefore(slotEnd, windowEnd) && !isEqual(slotEnd, windowEnd)) break;

      const slotStartStr = format(current, "HH:mm");
      const slotEndStr = format(slotEnd, "HH:mm");

      // Build full datetime for comparison
      const slotStartDT = new Date(`${dateStr}T${slotStartStr}:00`);
      const slotEndDT = new Date(`${dateStr}T${slotEndStr}:00`);

      // Check if this slot overlaps with any booked event
      const isBooked = bookedRanges.some(
        (booked) => slotStartDT < booked.end && slotEndDT > booked.start
      );

      slots.push({
        start: slotStartStr,
        end: slotEndStr,
        available: !isBooked,
      });

      // Move to next :00 or :30 (30-min cycle: 20 min lesson + 10 min buffer)
      current = addMinutes(current, 30);
    }
  }

  return slots;
}
