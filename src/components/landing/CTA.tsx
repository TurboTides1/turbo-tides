import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-navy via-navy-light to-blue-dark text-white relative overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16 sm:h-24">
          <path
            fill="#f9fafb"
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
          Ready to Dive In?
        </h2>
        <p className="text-lg text-gray-200 mb-8 max-w-xl mx-auto">
          Book a private lesson with Kayla or Jack and start improving your swim technique today.
        </p>
        <Link
          href="/book"
          className="inline-block bg-turquoise hover:bg-turquoise-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-colors"
        >
          Book a Lesson
        </Link>
      </div>
    </section>
  );
}
