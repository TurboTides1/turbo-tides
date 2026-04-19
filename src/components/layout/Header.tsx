"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold text-navy">
              Turbo<span className="text-turquoise">Tides</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#about" className="text-gray-600 hover:text-navy transition-colors font-medium">
              About
            </Link>
            <Link href="/#services" className="text-gray-600 hover:text-navy transition-colors font-medium">
              Services
            </Link>
            <Link href="/#instructors" className="text-gray-600 hover:text-navy transition-colors font-medium">
              Instructors
            </Link>
            <Link href="/#location" className="text-gray-600 hover:text-navy transition-colors font-medium">
              Location
            </Link>
            <Link
              href="/book"
              className="bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Book a Lesson
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3">
            <Link href="/#about" className="text-gray-600 hover:text-navy font-medium py-1" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/#services" className="text-gray-600 hover:text-navy font-medium py-1" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
            <Link href="/#instructors" className="text-gray-600 hover:text-navy font-medium py-1" onClick={() => setMenuOpen(false)}>
              Instructors
            </Link>
            <Link href="/#location" className="text-gray-600 hover:text-navy font-medium py-1" onClick={() => setMenuOpen(false)}>
              Location
            </Link>
            <Link
              href="/book"
              className="bg-turquoise hover:bg-turquoise-dark text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Book a Lesson
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
