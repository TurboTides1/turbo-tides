import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-3">
              Turbo<span className="text-turquoise">Tides</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Private swim lessons for young swimmers looking to advance in the sport.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/#about" className="hover:text-turquoise transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-turquoise transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#instructors" className="hover:text-turquoise transition-colors">
                  Instructors
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-turquoise transition-colors">
                  Book a Lesson
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Location</h4>
            <address className="text-sm text-gray-300 not-italic leading-relaxed">
              Glenview Swim Club<br />
              173 Paraiso Dr<br />
              Danville, CA 94526
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Turbo Tides. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
