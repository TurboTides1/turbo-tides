import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { instructors } from "@/lib/instructors";
import { getMergedInstructor } from "@/lib/instructor-profiles";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return instructors.map((i) => ({ slug: i.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const instructor = await getMergedInstructor(slug);
  if (!instructor) return {};

  return {
    title: `${instructor.name} — Swim Instructor`,
    description: `Book a private swim lesson with ${instructor.name} at Glenview Swim Club in Danville, CA. ${instructor.specialties.join(", ")}.`,
    openGraph: {
      title: `${instructor.name} — Turbo Tides Swim Instructor`,
      description: `Private swim lessons with ${instructor.name}. Specialties: ${instructor.specialties.join(", ")}.`,
      images: instructor.photoUrl ? [instructor.photoUrl] : undefined,
    },
  };
}

export default async function InstructorPage({ params }: Props) {
  const { slug } = await params;
  const instructor = await getMergedInstructor(slug);
  if (!instructor) notFound();

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/#instructors"
          className="text-turquoise-dark hover:text-turquoise font-medium mb-8 inline-flex items-center gap-1 transition-colors"
        >
          &larr; Back to all instructors
        </Link>

        <div className="mt-8 text-center">
          {/* Avatar or photo */}
          <div className="w-32 h-32 bg-gradient-to-br from-turquoise to-blue rounded-full flex items-center justify-center text-white text-5xl font-heading font-bold mx-auto mb-6 overflow-hidden relative">
            {instructor.photoUrl ? (
              <Image
                src={instructor.photoUrl}
                alt={instructor.name}
                fill
                sizes="128px"
                className="object-cover"
                priority
              />
            ) : (
              instructor.name[0]
            )}
          </div>

          <h1 className="text-4xl font-heading font-bold text-navy mb-4">
            {instructor.name}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            {instructor.bio}
          </p>

          {/* Intro video */}
          {instructor.videoUrl && (
            <div className="mb-10">
              <video
                src={instructor.videoUrl}
                controls
                playsInline
                className="w-full max-w-xl mx-auto rounded-2xl bg-black shadow-sm"
              />
            </div>
          )}

          {/* Specialties */}
          <div className="mb-10">
            <h2 className="text-lg font-heading font-semibold text-navy mb-4">
              Specialties
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {instructor.specialties.map((s) => (
                <span
                  key={s}
                  className="bg-turquoise/10 text-turquoise-dark font-medium px-4 py-2 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10">
            <div className="text-3xl font-heading font-bold text-turquoise mb-1">$25</div>
            <div className="text-gray-600">per 20-minute private lesson</div>
            <div className="text-sm text-gray-500 mt-2">
              At Glenview Swim Club, Danville, CA
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/book"
            className="inline-block bg-turquoise hover:bg-turquoise-dark text-white font-bold px-10 py-4 rounded-full text-lg transition-colors"
          >
            Book a Lesson with {instructor.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
