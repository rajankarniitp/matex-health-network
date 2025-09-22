
const testimonials = [
  {
    content: "DocMateX has revolutionized how I connect with fellow medical professionals. The platform's focus on verified healthcare workers gives me confidence in the connections I make.",
    author: "Dr. Sarah Johnson",
    role: "Cardiologist",
    location: "Mayo Clinic"
  },
  {
    content: "As a medical researcher, finding collaborators was always challenging. DocMateX's research hub has opened doors to international collaborations I never thought possible.",
    author: "Dr. Michael Chen",
    role: "Medical Researcher",
    location: "Stanford Medical School"
  },
  {
    content: "The mentorship matching feature helped me find incredible mentors during my residency. The knowledge sharing on this platform is unparalleled.",
    author: "Dr. Priya Patel",
    role: "Internal Medicine Resident",
    location: "AIIMS Delhi"
  }
];

const Testimonials = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            What Healthcare Professionals Say
          </h2>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 px-2">
            Hear from doctors, researchers, and medical students who trust DocMateX
          </p>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/25 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 dark:text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{testimonial.author}</div>
                <div className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base">{testimonial.role}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
