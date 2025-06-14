
import {
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  BookOpen,
  Calendar,
  Search,
  Award,
  Brain,
  Stethoscope,
  Heart,
  UserPlus,
  MessageCircle,
  Shield,
  Globe,
  Zap,
  Database,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: 'Mate System',
    description: 'Connect with healthcare professionals through our unique Mate system. Build meaningful professional relationships with verified doctors, researchers, and medical students worldwide.',
    color: 'blue'
  },
  {
    icon: MessageCircle,
    title: 'Real-time Messaging',
    description: 'Secure, HIPAA-compliant messaging system for healthcare professionals. Share insights, collaborate on cases, and stay connected with your medical network.',
    color: 'green'
  },
  {
    icon: MessageSquare,
    title: 'Discussion Forums',
    description: 'Engage in medical discussions, share insights, and collaborate on complex cases with peers worldwide. Specialized forums for every medical specialty.',
    color: 'purple'
  },
  {
    icon: FileText,
    title: 'Case Studies Hub',
    description: 'Share and analyze clinical cases with detailed documentation. Learn from real-world scenarios and contribute to medical knowledge through peer review.',
    color: 'orange'
  },
  {
    icon: Briefcase,
    title: 'Medical Job Board',
    description: 'Discover career opportunities, residencies, fellowships, and positions tailored for healthcare professionals. Connect directly with top medical institutions.',
    color: 'indigo'
  },
  {
    icon: BookOpen,
    title: 'Research Hub',
    description: 'Access and publish medical research, papers, and studies. Collaborate with researchers globally and contribute to advancing medical science.',
    color: 'red'
  },
  {
    icon: Calendar,
    title: 'Medical Events',
    description: 'Stay updated with conferences, webinars, CMEs, and workshops. Never miss important medical events and earn continuing education credits.',
    color: 'teal'
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find professionals by specialization, location, and interests. AI-powered recommendations help you connect with the right medical experts.',
    color: 'cyan'
  },
  {
    icon: Award,
    title: 'Mentorship Program',
    description: 'Connect with experienced mentors or guide the next generation of healthcare professionals. Structured mentorship with goal tracking.',
    color: 'pink'
  },
  {
    icon: Brain,
    title: 'Doxy AI Assistant',
    description: 'Get AI-powered insights, medical information, and assistance for your professional queries. Your intelligent medical companion.',
    color: 'violet'
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'All medical professionals are verified through credential checking. Trust and authenticity are paramount in our medical community.',
    color: 'emerald'
  },
  {
    icon: Heart,
    title: 'Wellness Support',
    description: 'Mental health resources and wellness support specifically designed for healthcare professionals. Because taking care of yourself matters.',
    color: 'rose'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Connect with healthcare professionals from around the world. Break geographical barriers and collaborate internationally.',
    color: 'blue'
  },
  {
    icon: Stethoscope,
    title: 'Clinical Tools',
    description: 'Access medical calculators, drug references, and clinical decision support tools integrated directly into your professional network.',
    color: 'green'
  },
  {
    icon: Database,
    title: 'Medical Database',
    description: 'Comprehensive medical database with the latest research, treatment protocols, and evidence-based medicine resources.',
    color: 'purple'
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    description: 'Stay updated with real-time notifications about your network activities, new research in your field, and important medical updates.',
    color: 'yellow'
  }
];

const Features = () => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue:
        "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-900",
      green:
        "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-900",
      purple:
        "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-900",
      orange:
        "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-900",
      red:
        "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-900",
      indigo:
        "bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-900",
      teal:
        "bg-teal-100 text-teal-600 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-900",
      pink:
        "bg-pink-100 text-pink-600 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-900",
      cyan:
        "bg-cyan-100 text-cyan-600 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-900",
      violet:
        "bg-violet-100 text-violet-600 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-900",
      emerald:
        "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-900",
      rose:
        "bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900",
      yellow:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-900",
    };
    return (
      colorMap[color as keyof typeof colorMap] ||
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800"
    );
  };

  return (
    <div
      className="py-12 sm:py-16 lg:py-24
        bg-gradient-to-br from-blue-50 to-white
        dark:from-[#131a24] dark:to-gray-900 
        transition-colors duration-300"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Complete Healthcare Professional Platform
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            DocMateX provides comprehensive tools and features designed specifically for healthcare professionals,
            researchers, and medical students. Everything you need to advance your medical career in one platform.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm dark:shadow-md hover:shadow-lg dark:hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1"
            >
              <div
                className={`inline-flex p-2 sm:p-3 rounded-lg border ${getColorClasses(feature.color)}`}
              >
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-600 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/50 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-300" />
            <span className="text-blue-900 dark:text-blue-100 font-medium text-sm sm:text-base">
              All features are HIPAA-compliant and secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
