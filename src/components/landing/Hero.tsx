import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-light to-blue-dark text-white">
      {/* Wave pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="currentColor"
            className="text-turquoise"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6">
            Make Waves with{" "}
            <span className="text-turquoise">Turbo Tides</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
            Private swim lessons for young swimmers in Danville, CA. Build confidence, master technique, and have fun in the water.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="bg-turquoise hover:bg-turquoise-dark text-white font-bold px-8 py-3.5 rounded-full text-lg transition-colors text-center"
            >
              Book a Lesson
            </Link>
            <Link
              href="#about"
              className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-full text-lg transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-16 sm:h-24">
          <path
            fill="white"
            d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,70 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>
    </section>
  );
}
