import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const availabilityWindows = sqliteTable("availability_windows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instructorSlug: text("instructor_slug").notNull(), // "kayla" or "jack"
  dayOfWeek: integer("day_of_week"), // 0=Sun, 1=Mon, ..., 6=Sat (null if one-off)
  specificDate: text("specific_date"), // "2026-06-15" (null if recurring)
  startTime: text("start_time").notNull(), // "09:00" (24h)
  endTime: text("end_time").notNull(), // "12:00"
  effectiveFrom: text("effective_from"), // when recurring window starts
  effectiveUntil: text("effective_until"), // when it ends (null = indefinite)
});

export type AvailabilityWindow = typeof availabilityWindows.$inferSelect;
export type NewAvailabilityWindow = typeof availabilityWindows.$inferInsert;
