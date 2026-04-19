import { google, calendar_v3 } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const refreshTokens: Record<string, string> = {
  kayla: process.env.GOOGLE_REFRESH_TOKEN_KAYLA!,
  jack: process.env.GOOGLE_REFRESH_TOKEN_JACK!,
};

const calendarIds: Record<string, string> = {
  kayla: process.env.GOOGLE_CALENDAR_ID_KAYLA!,
  jack: process.env.GOOGLE_CALENDAR_ID_JACK!,
};

function getAuth(instructorSlug: string) {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({
    refresh_token: refreshTokens[instructorSlug],
  });
  return oauth2Client;
}

function getCalendarClient(instructorSlug: string): calendar_v3.Calendar {
  return google.calendar({ version: "v3", auth: getAuth(instructorSlug) });
}

export function getCalendarId(instructorSlug: string): string {
  return calendarIds[instructorSlug];
}

/**
 * List events for an instructor on a given date (in America/Los_Angeles).
 */
export async function listEvents(
  instructorSlug: string,
  dateStr: string
): Promise<calendar_v3.Schema$Event[]> {
  const cal = getCalendarClient(instructorSlug);
  const calendarId = getCalendarId(instructorSlug);

  const timeMin = new Date(`${dateStr}T00:00:00-07:00`).toISOString();
  const timeMax = new Date(`${dateStr}T23:59:59-07:00`).toISOString();

  const res = await cal.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: "America/Los_Angeles",
  });

  return res.data.items ?? [];
}

/**
 * List events for an instructor across a date range.
 */
export async function listEventsRange(
  instructorSlug: string,
  startDate: string,
  endDate: string
): Promise<calendar_v3.Schema$Event[]> {
  const cal = getCalendarClient(instructorSlug);
  const calendarId = getCalendarId(instructorSlug);

  const timeMin = new Date(`${startDate}T00:00:00-07:00`).toISOString();
  const timeMax = new Date(`${endDate}T23:59:59-07:00`).toISOString();

  const res = await cal.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: "America/Los_Angeles",
  });

  return res.data.items ?? [];
}

/**
 * Create a calendar event for a booked lesson.
 */
export async function createEvent(
  instructorSlug: string,
  summary: string,
  description: string,
  startDateTime: string,
  endDateTime: string
): Promise<calendar_v3.Schema$Event> {
  const cal = getCalendarClient(instructorSlug);
  const calendarId = getCalendarId(instructorSlug);

  const res = await cal.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Los_Angeles",
      },
    },
  });

  return res.data;
}

/**
 * Delete a calendar event by event ID.
 */
export async function deleteEvent(
  instructorSlug: string,
  eventId: string
): Promise<void> {
  const cal = getCalendarClient(instructorSlug);
  const calendarId = getCalendarId(instructorSlug);

  await cal.events.delete({ calendarId, eventId });
}

/**
 * Parse client name and phone from a calendar event description.
 * Expected format: "Client: Name\nPhone: +1234567890"
 */
export function parseClientInfo(description: string | null | undefined): {
  name: string;
  phone: string;
} {
  const name = description?.match(/Client:\s*(.+)/)?.[1]?.trim() ?? "Unknown";
  const phone = description?.match(/Phone:\s*(.+)/)?.[1]?.trim() ?? "";
  return { name, phone };
}
