import { instructors } from "@/lib/instructors";

interface Props {
  onSelect: (slug: string) => void;
}

export default function InstructorPicker({ onSelect }: Props) {
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-navy mb-4 text-center">
        Choose Your Instructor
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {instructors.map((inst) => (
          <button
            key={inst.slug}
            onClick={() => onSelect(inst.slug)}
            className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-turquoise transition-colors text-left"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-turquoise to-blue rounded-full flex items-center justify-center text-white text-2xl font-heading font-bold mb-4">
              {inst.name[0]}
            </div>
            <h3 className="text-lg font-heading font-semibold text-navy mb-1">
              {inst.name}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {inst.specialties.map((s) => (
                <span
                  key={s}
                  className="bg-turquoise/10 text-turquoise-dark text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
