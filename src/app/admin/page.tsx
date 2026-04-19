import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listEventsRange, parseClientInfo } from "@/lib/google-calendar";
import { instructors } from "@/lib/instructors";
import { format, addDays } from "date-fns";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const today = new Date();
  const startDate = format(today, "yyyy-MM-dd");
  const endDate = format(addDays(today, 7), "yyyy-MM-dd");

  // Fetch upcoming lessons for both instructors
  const upcomingByInstructor = await Promise.all(
    instructors.map(async (instructor) => {
      const events = await listEventsRange(instructor.slug, startDate, endDate);
      const lessons = events
        .filter((e) => e.start?.dateTime && e.summary?.toLowerCase().includes("swim lesson"))
        .map((e) => {
          const { name, phone } = parseClientInfo(e.description);
          return {
            id: e.id ?? "",
            summary: e.summary ?? "",
            start: e.start!.dateTime!,
            end: e.end?.dateTime ?? "",
            clientName: name,
            clientPhone: phone,
          };
        });
      return { instructor, lessons };
    })
  );

  const totalLessons = upcomingByInstructor.reduce(
    (sum, { lessons }) => sum + lessons.length,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-navy mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-500">Upcoming Lessons</div>
          <div className="text-3xl font-heading font-bold text-navy mt-1">{totalLessons}</div>
          <div className="text-sm text-gray-400">Next 7 days</div>
        </div>
        {upcomingByInstructor.map(({ instructor, lessons }) => (
          <div key={instructor.slug} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">{instructor.name}&apos;s Lessons</div>
            <div className="text-3xl font-heading font-bold text-turquoise mt-1">
              {lessons.length}
            </div>
            <div className="text-sm text-gray-400">Next 7 days</div>
          </div>
        ))}
      </div>

      {/* Upcoming lessons by instructor */}
      {upcomingByInstructor.map(({ instructor, lessons }) => (
        <div key={instructor.slug} className="mb-8">
          <h2 className="text-lg font-heading font-semibold text-navy mb-3">
            {instructor.name}&apos;s Upcoming Lessons
          </h2>

          {lessons.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow-sm text-gray-500">
              No lessons scheduled in the next 7 days.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-500">Time</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-500">Client</th>
                    <th className="px-5 py-3 text-sm font-medium text-gray-500">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => {
                    const start = new Date(lesson.start);
                    return (
                      <tr key={lesson.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-sm">
                          {format(start, "EEE, MMM d")}
                        </td>
                        <td className="px-5 py-3 text-sm">
                          {format(start, "h:mm a")}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium">
                          {lesson.clientName}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {lesson.clientPhone || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
