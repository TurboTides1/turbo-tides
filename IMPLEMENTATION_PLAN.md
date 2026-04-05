# Turbo Tides — Full Implementation Plan

## What We're Building

A swim lesson booking website for Kayla and Jack, two young swim instructors operating out of **Glenview Swim Club** (173 Paraiso Dr, Danville, CA 94526). The site lets the public browse available lesson times and book 20-minute sessions ($25 each). Google Calendar is the backend for scheduling. Twilio sends SMS notifications.

**Domain:** turbotides.us

---

## Business Details

- **Instructors:** Kayla (kaybay0405@gmail.com) and Jack (jackarneson51@gmail.com)
- **Location:** Glenview Swim Club, 173 Paraiso Dr, Danville, CA 94526
- **Pricing:** $25 per 20-minute lesson (payment handled offline — cash, Venmo, etc.)
- **Lesson slots:** 20-minute increments starting at :00 and :30 (10-min buffer between lessons)
- **Services:** All four strokes, dives and turns, swimming fundamentals (body position, breathing, pull patterns, balance)
- **Target audience:** Young swimmers looking to advance in the sport
- **Branding:** Turquoise and blue tones, professional but fun/kid-friendly

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Full-stack, great social preview support, one codebase |
| Styling | Tailwind CSS v4 | Fast to build, turquoise/blue theme, responsive |
| Hosting | Vercel (free tier) | Zero-config deploy from GitHub, custom domain |
| Database | Turso (hosted SQLite) + Drizzle ORM | Free tier, relational queries for availability windows |
| Calendar | Google Calendar API (service account) | Source of truth for bookings, visible on kids' phones |
| Auth | Auth.js v5 (credentials provider) | 3 admin accounts: David, Kayla, Jack |
| SMS | Twilio | Booking confirmations + cancellation notifications |
| Date utils | date-fns | Lightweight date manipulation |
| Date picker | react-day-picker | Calendar UI for booking flow |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, OG metadata
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Tailwind + custom styles
│   ├── instructors/[slug]/page.tsx   # Instructor profile
│   ├── book/
│   │   ├── page.tsx                  # Multi-step booking flow
│   │   └── confirmation/page.tsx     # Booking success
│   ├── admin/
│   │   ├── layout.tsx                # Auth-gated admin shell
│   │   ├── page.tsx                  # Dashboard
│   │   ├── login/page.tsx            # Login form
│   │   ├── availability/page.tsx     # Manage availability
│   │   └── schedule/page.tsx         # View/cancel lessons
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── availability/route.ts     # CRUD availability windows
│       ├── slots/route.ts            # GET available time slots
│       ├── book/route.ts             # POST create booking
│       ├── cancel/route.ts            # POST cancel booking
│       └── sms/
│           └── incoming/route.ts     # Twilio webhook — forward customer replies to instructor
├── lib/
│   ├── google-calendar.ts            # Calendar API wrapper
│   ├── twilio.ts                     # SMS helper
│   ├── db/index.ts                   # Drizzle + Turso client
│   ├── db/schema.ts                  # availability_windows table
│   ├── auth.ts                       # Auth.js exports
│   ├── auth.config.ts                # Credentials provider config
│   ├── instructors.ts                # Static config (names, bios, calendar IDs, phone numbers)
│   └── slots.ts                      # Slot generation algorithm
├── components/
│   ├── layout/                       # Header, Footer
│   ├── landing/                      # Hero, Services, InstructorCards, Location
│   ├── booking/                      # InstructorPicker, DatePicker, SlotGrid, BookingForm
│   └── admin/                        # AvailabilityForm, ScheduleTable, CancelDialog
└── middleware.ts                      # Protect /admin routes
```

---

## Database Schema

One table — `availability_windows`. All bookings live in Google Calendar.

| Column | Type | Purpose |
|--------|------|---------|
| id | INTEGER PK | Auto-increment |
| instructor_slug | TEXT | "kayla" or "jack" |
| day_of_week | INTEGER | 0-6 for recurring (null if one-off) |
| specific_date | TEXT | "2026-06-15" for one-off (null if recurring) |
| start_time | TEXT | "09:00" (24h format) |
| end_time | TEXT | "12:00" |
| effective_from | TEXT | When recurring window starts |
| effective_until | TEXT | When it ends (null = indefinite) |

---

## Environment Variables Needed

```
# Auth.js
AUTH_SECRET=<random-32-char-string>
ADMIN_USERS=david:<bcrypt_hash>,kayla:<bcrypt_hash>,jack:<bcrypt_hash>

# Google Calendar Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=turbo-tides@project-id.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_CALENDAR_ID_KAYLA=kaybay0405@gmail.com
GOOGLE_CALENDAR_ID_JACK=jackarneson51@gmail.com

# Turso
TURSO_DATABASE_URL=libsql://turbo-tides-<account>.turso.io
TURSO_AUTH_TOKEN=<token>

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Instructor Phone Numbers (for SMS reply forwarding)
INSTRUCTOR_PHONE_KAYLA=+1...
INSTRUCTOR_PHONE_JACK=+1...

# Site
NEXT_PUBLIC_SITE_URL=https://turbotides.us
```

---

## Milestones

### Milestone 1: Project Scaffolding & Landing Page ← WE START HERE
- Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Configure Tailwind theme: turquoise (#40E0D0), blue (#1E90FF), coral accent (#FF6B6B)
- Fonts: Inter (body) + Poppins (headings) via next/font/google
- Landing page sections:
  - **Hero**: Full-width water background, "Turbo Tides" title, tagline, "Book a Lesson" CTA
  - **About/Pricing**: Description of program, $25/20-min pricing
  - **Services**: Cards for four strokes, dives/turns, fundamentals
  - **Instructor Cards**: Kayla and Jack with placeholder photos/bios
  - **Location**: Google Maps embed for 173 Paraiso Dr, Danville, CA 94526
  - **CTA Footer**: "Ready to dive in?" with book button
- OpenGraph + Twitter Card metadata for social media previews
- Instructor profile pages at /instructors/kayla and /instructors/jack
- Responsive Header with mobile hamburger menu
- Footer with address and contact info

### Milestone 2: Google Calendar Integration
- Set up Google Cloud project with Calendar API enabled
- Create service account, share Kayla's and Jack's calendars with it
- `lib/google-calendar.ts`: getCalendarClient(), listEvents(), createEvent(), deleteEvent(), parseClientInfo()
- `lib/slots.ts`: getAvailableSlots(instructor, date) — queries availability windows, generates 20-min slots at :00/:30, subtracts booked events
- `GET /api/slots?instructor=X&date=YYYY-MM-DD` public endpoint
- All times in America/Los_Angeles timezone

### Milestone 3: Admin Auth & Dashboard
- Auth.js v5 with Credentials provider, bcrypt password hashes in env vars
- middleware.ts to protect /admin/* routes (redirect to /admin/login)
- Admin login page with username/password form
- Admin dashboard showing upcoming lessons (next 7 days) per instructor
- Admin layout with sidebar: Dashboard, Availability, Schedule, Sign Out

### Milestone 4: Availability Management
- Drizzle ORM + Turso database setup
- API routes: POST/GET/DELETE /api/availability (admin-only)
- Admin availability page: tabbed per instructor
- Form to add recurring ("Every Tuesday 9am-12pm") or one-time availability
- Delete button with confirmation on each window

### Milestone 5: Public Booking Flow
- Multi-step booking page: Pick Instructor → Pick Date → Pick Slot → Enter Info → Confirm
- Date picker using react-day-picker
- Slot grid showing available times as buttons
- Booking form: name + phone number (no account needed)
- POST /api/book: validates, re-checks availability, creates Calendar event, sends confirmation SMS
- Calendar event: summary="Swim Lesson - ClientName", description has client name + phone
- Confirmation page with details and $25 payment reminder

### Milestone 6: Cancellation, Notifications & SMS Reply Forwarding
- Admin schedule page: upcoming 14 days of lessons, filterable by instructor
- Each lesson shows date, time, client name/phone
- Cancel button with confirmation dialog
- POST /api/cancel: deletes Calendar event, sends SMS to client with apology and re-booking link
- **SMS Reply Forwarding:**
  - `POST /api/sms/incoming` — Twilio webhook endpoint
  - When a customer texts back to the Twilio number, Twilio POSTs to this endpoint with the sender's phone number and message body
  - The app looks up the sender's phone number against upcoming Google Calendar events (both instructors) to find which instructor has a lesson with that customer
  - Forwards the message via SMS to that instructor's personal phone: "Message from [ClientName]: [their message]"
  - If the phone number doesn't match any upcoming booking, forwards to David's phone as a fallback
  - Returns TwiML `<Response/>` (empty) so Twilio doesn't auto-reply
  - **Twilio setup:** In the Twilio console, set the "When a message comes in" webhook URL to `https://turbotides.us/api/sms/incoming` (HTTP POST)

### Milestone 7: Polish & Launch
- Loading states (skeleton loaders) and error boundaries
- Mobile testing at 320px, 768px, 1280px
- Create OG image (1200x630) with Turbo Tides branding
- Deploy to Vercel, configure turbotides.us domain
- Write family-friendly README with how-to guides

---

## Prerequisites (Before Resuming)

1. **Update macOS** (in progress)
2. **Install Node.js**: `brew install node` (failed due to macOS version — retry after update)
3. **Verify**: `node --version && npm --version` should both show version numbers

---

## External Accounts to Set Up (Can Do Anytime)

1. **Vercel** (vercel.com) — sign up with GitHub, free tier
2. **Google Cloud Console** (console.cloud.google.com) — create project "Turbo Tides", enable Calendar API, create service account
3. **Turso** (turso.tech) — sign up, create database "turbo-tides"
4. **Twilio** (twilio.com) — sign up, get a phone number for SMS
5. **GitHub** — create repo for the project (needed for Vercel auto-deploy)

---

## How to Resume

Open Claude Code in the Turbo Tides directory and say:
"Let's resume building Turbo Tides. Start with Milestone 1."

Claude will have the full plan in memory and in this file.
