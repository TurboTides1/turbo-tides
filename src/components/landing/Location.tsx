export default function Location() {
  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy mb-4">
            Where to Find Us
          </h2>
          <p className="text-lg text-gray-600">
            Lessons take place at Glenview Swim Club in Danville, CA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-heading font-semibold text-navy mb-4">
                Glenview Swim Club
              </h3>
              <address className="text-gray-600 not-italic leading-relaxed mb-6">
                173 Paraiso Dr<br />
                Danville, CA 94526
              </address>
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
                  <span>$25 per lesson &mdash; cash, Venmo, or Zelle accepted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm h-[300px] sm:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.5!2d-121.9999!3d37.8199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f8e2b89f4d3a1%3A0x4a5e9e8b8b8b8b8b!2s173+Paraiso+Dr%2C+Danville%2C+CA+94526!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Glenview Swim Club location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
