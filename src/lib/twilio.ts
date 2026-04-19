import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Check if Twilio is configured. SMS functions gracefully skip if not.
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber);
}

function getClient() {
  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not configured");
  }
  return twilio(accountSid, authToken);
}

/**
 * Send a raw SMS message.
 */
export async function sendSMS(to: string, body: string): Promise<void> {
  if (!isTwilioConfigured()) {
    console.log("[Twilio not configured] Would send SMS to", to, ":", body);
    return;
  }

  const client = getClient();
  await client.messages.create({
    body,
    from: fromNumber,
    to,
  });
}

/**
 * Send booking confirmation SMS to the client.
 */
export async function sendBookingConfirmation(
  phone: string,
  clientName: string,
  instructorName: string,
  date: string,
  time: string
): Promise<void> {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const formattedTime = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;

  const body =
    `Hi ${clientName}! Your swim lesson with ${instructorName} is confirmed:\n\n` +
    `${formattedDate} at ${formattedTime}\n` +
    `Glenview Swim Club, 173 Paraiso Dr, Danville\n` +
    `$25 due at the pool\n\n` +
    `See you there! - Turbo Tides`;

  await sendSMS(phone, body);
}

/**
 * Send cancellation SMS to the client.
 */
export async function sendCancellationNotice(
  phone: string,
  clientName: string,
  instructorName: string,
  date: string,
  time: string
): Promise<void> {
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const formattedTime = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;

  const body =
    `Hi ${clientName}, unfortunately your swim lesson with ${instructorName} ` +
    `on ${formattedDate} at ${formattedTime} has been cancelled.\n\n` +
    `We're sorry for the inconvenience. You can rebook at https://turbotides.us/book\n\n` +
    `- Turbo Tides`;

  await sendSMS(phone, body);
}

/**
 * Forward a customer's SMS reply to the instructor's phone.
 */
export async function forwardToInstructor(
  instructorPhone: string,
  clientName: string,
  messageBody: string
): Promise<void> {
  const body = `Message from ${clientName}: ${messageBody}`;
  await sendSMS(instructorPhone, body);
}
