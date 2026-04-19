import { NextRequest, NextResponse } from "next/server";
import { listEventsRange, parseClientInfo } from "@/lib/google-calendar";
import { forwardToInstructor } from "@/lib/twilio";
import { instructors } from "@/lib/instructors";
import { format, addDays } from "date-fns";

const instructorPhones: Record<string, string | undefined> = {
  kayla: process.env.INSTRUCTOR_PHONE_KAYLA,
  jack: process.env.INSTRUCTOR_PHONE_JACK,
};

const fallbackPhone = process.env.INSTRUCTOR_PHONE_DAVID;

/**
 * POST /api/sms/incoming
 * Twilio webhook — when a customer texts back, forward to the appropriate instructor.
 *
 * Twilio sends form-encoded data with From (sender phone) and Body (message text).
 * We look up the sender's phone against upcoming calendar events to find which
 * instructor has a lesson with them, then forward the message.
 *
 * Returns empty TwiML so Twilio doesn't auto-reply.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const senderPhone = formData.get("From") as string;
  const messageBody = formData.get("Body") as string;

  if (!senderPhone || !messageBody) {
    return new NextResponse("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  }

  // Normalize phone: strip spaces, dashes
  const normalizedSender = senderPhone.replace(/[\s\-()]/g, "");

  try {
    const today = format(new Date(), "yyyy-MM-dd");
    const twoWeeksOut = format(addDays(new Date(), 14), "yyyy-MM-dd");

    // Search upcoming events across both instructors
    for (const inst of instructors) {
      const events = await listEventsRange(inst.slug, today, twoWeeksOut);

      for (const event of events) {
        const { name, phone } = parseClientInfo(event.description);
        const normalizedEventPhone = phone.replace(/[\s\-()]/g, "");

        if (normalizedEventPhone && normalizedSender.includes(normalizedEventPhone.slice(-10))) {
          // Found a match — forward to this instructor
          const instructorPhone = instructorPhones[inst.slug];
          if (instructorPhone) {
            await forwardToInstructor(instructorPhone, name, messageBody);
          } else if (fallbackPhone) {
            await forwardToInstructor(fallbackPhone, name, messageBody);
          }

          return new NextResponse("<Response/>", {
            headers: { "Content-Type": "text/xml" },
          });
        }
      }
    }

    // No match — forward to David as fallback
    if (fallbackPhone) {
      await forwardToInstructor(
        fallbackPhone,
        `Unknown (${senderPhone})`,
        messageBody
      );
    }
  } catch (error) {
    console.error("Error processing incoming SMS:", error);
  }

  return new NextResponse("<Response/>", {
    headers: { "Content-Type": "text/xml" },
  });
}
