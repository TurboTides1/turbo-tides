import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Turbo Tides",
  description:
    "How Turbo Tides collects, uses, and protects your personal information, including phone numbers used for SMS communications about swim lessons.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-navy mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated: May 12, 2026 (revised)
      </p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Who we are
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Turbo Tides is a small family-run swim lesson business operating at
            Glenview Swim Club in Danville, California. This policy explains
            what information we collect when you book a lesson through{" "}
            <Link href="/" className="text-turquoise hover:underline">
              turbotides.us
            </Link>
            , how we use it, and your choices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Information we collect
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            When you book a lesson, we ask for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Your name</li>
            <li>Your mobile phone number</li>
            <li>
              The date and time of your requested lesson, and which instructor
              it is with
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            We do not collect payment information through this website —
            payment is handled in person at the pool.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            How we use your phone number
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your phone number is used only so that your instructor can reach
            out personally if there is a change to your lesson (for example, a
            cancellation or rescheduling). We do not send automated text
            messages or marketing communications, and we do not share your
            phone number with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            How we store and share your information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Booking details (your name, phone number, and lesson time) are
            stored in the calendar of the instructor you book with, which is
            hosted by Google Calendar. We do not sell or rent your information
            to any third party. We retain booking records only for as long as
            is reasonably needed to run the business.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Children&apos;s privacy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Our lessons are for young swimmers, but bookings are made by a
            parent or guardian, and the phone number we collect is the
            parent&apos;s. We do not knowingly collect personal information
            directly from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Your choices
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              You can ask us to delete your booking record by contacting us.
            </li>
            <li>
              You can book by contacting us directly rather than using the
              online booking form.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Contact us
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Questions about this policy, or requests to access or delete your
            information, can be sent to{" "}
            <a
              href="mailto:dave@arnesonhomes.com"
              className="text-turquoise hover:underline"
            >
              dave@arnesonhomes.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-navy mb-3">
            Changes to this policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            If we make material changes to this policy, we will update the
            &quot;Last updated&quot; date above and, where appropriate, notify
            you.
          </p>
        </section>
      </div>
    </div>
  );
}
