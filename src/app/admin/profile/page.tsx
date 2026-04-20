import Link from "next/link";
import Image from "next/image";
import { getAllMergedInstructors } from "@/lib/instructor-profiles";

export const dynamic = "force-dynamic";

export default async function AdminProfileList() {
  const list = await getAllMergedInstructors();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-navy mb-2">
        Instructor Profiles
      </h1>
      <p className="text-gray-500 mb-6">
        Edit the name, bio, specialties, photo, and intro video that parents
        see on each instructor&apos;s public profile.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {list.map((inst) => (
          <div
            key={inst.slug}
            className="bg-white rounded-xl shadow-sm p-6 flex gap-5 items-start"
          >
            <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-turquoise to-blue flex items-center justify-center text-white text-2xl font-heading font-bold relative">
              {inst.photoUrl ? (
                <Image
                  src={inst.photoUrl}
                  alt={inst.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                inst.name[0]
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-heading font-semibold text-navy">
                {inst.name}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {inst.bio}
              </p>
              <Link
                href={`/admin/profile/${inst.slug}`}
                className="inline-block bg-turquoise hover:bg-turquoise-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
