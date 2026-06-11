export default function Location() {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy mb-4">
          Where We Swim
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Serving the Greenbrook and Sycamore neighborhoods of Danville, CA.
          The exact pool address is shared with you after your booking is
          confirmed.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-sm inline-block text-left">
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-turquoise mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Lesson times vary by instructor availability</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-turquoise mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>$30 per lesson &mdash; cash, Venmo, or Zelle accepted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
