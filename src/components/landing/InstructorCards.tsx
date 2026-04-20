import Link from "next/link";
import Image from "next/image";
import { getAllMergedInstructors } from "@/lib/instructor-profiles";

export default async function InstructorCards() {
  const list = await getAllMergedInstructors();

  return (
    <section id="instructors" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy mb-4">
            Meet Your Instructors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Friendly, experienced instructors who make learning to swim fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {list.map((instructor) => (
            <div
              key={instructor.slug}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-turquoise/30 transition-colors"
            >
              {/* Avatar or photo */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-turquoise to-blue flex items-center justify-center text-white text-3xl font-heading font-bold mb-5 mx-auto relative">
                {instructor.photoUrl ? (
                  <Image
                    src={instructor.photoUrl}
                    alt={instructor.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  instructor.name[0]
                )}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-heading font-bold text-navy mb-3">
                  {instructor.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">{instructor.bio}</p>

                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {instructor.specialties.map((s) => (
                    <span
                      key={s}
                      className="bg-turquoise/10 text-turquoise-dark text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/instructors/${instructor.slug}`}
                  className="text-turquoise-dark hover:text-turquoise font-semibold transition-colors"
                >
                  View Profile &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
