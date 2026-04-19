import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { availabilityWindows } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getInstructor } from "@/lib/instructors";

/**
 * GET /api/availability?instructor=kayla
 * Returns all availability windows for the given instructor.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const instructor = request.nextUrl.searchParams.get("instructor");
  if (!instructor || !getInstructor(instructor)) {
    return NextResponse.json({ error: "Invalid instructor" }, { status: 400 });
  }

  const windows = await db
    .select()
    .from(availabilityWindows)
    .where(eq(availabilityWindows.instructorSlug, instructor));

  return NextResponse.json({ windows });
}

/**
 * POST /api/availability
 * Create a new availability window.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { instructorSlug, type, dayOfWeek, specificDate, startTime, endTime, effectiveFrom, effectiveUntil } = body;

  if (!instructorSlug || !getInstructor(instructorSlug)) {
    return NextResponse.json({ error: "Invalid instructor" }, { status: 400 });
  }

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "Start and end time are required" }, { status: 400 });
  }

  if (startTime >= endTime) {
    return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });
  }

  if (type === "recurring" && (dayOfWeek === null || dayOfWeek === undefined)) {
    return NextResponse.json({ error: "Day of week is required for recurring availability" }, { status: 400 });
  }

  if (type === "one-off" && !specificDate) {
    return NextResponse.json({ error: "Date is required for one-off availability" }, { status: 400 });
  }

  const [created] = await db
    .insert(availabilityWindows)
    .values({
      instructorSlug,
      dayOfWeek: type === "recurring" ? dayOfWeek : null,
      specificDate: type === "one-off" ? specificDate : null,
      startTime,
      endTime,
      effectiveFrom: type === "recurring" ? (effectiveFrom || null) : null,
      effectiveUntil: type === "recurring" ? (effectiveUntil || null) : null,
    })
    .returning();

  return NextResponse.json({ window: created }, { status: 201 });
}

/**
 * DELETE /api/availability?id=123
 * Delete an availability window by ID.
 */
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  await db
    .delete(availabilityWindows)
    .where(eq(availabilityWindows.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
