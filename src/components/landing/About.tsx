export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-navy mb-6">
            About Turbo Tides
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Turbo Tides offers private swim lessons designed for young swimmers who want to take their skills to the next level. Whether your child is working on the basics or refining competitive strokes, our instructors provide personalized, one-on-one coaching in a fun, supportive environment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl font-heading font-bold text-turquoise mb-2">20 min</div>
              <div className="text-gray-600 font-medium">Per Lesson</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl font-heading font-bold text-turquoise mb-2">$25</div>
              <div className="text-gray-600 font-medium">Per Session</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl font-heading font-bold text-turquoise mb-2">1-on-1</div>
              <div className="text-gray-600 font-medium">Private Lessons</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
