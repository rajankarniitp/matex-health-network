
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
  Database
} from 'lucide-react';

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
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      violet: 'bg-violet-100 text-violet-600 border-violet-200',
      emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      rose: 'bg-rose-100 text-rose-600 border-rose-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  return (
    <div className="py-24 bg-gradient-to-br from-blue-50 to-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Complete Healthcare Professional Platform
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-4xl mx-auto">
            DocMateX provides comprehensive tools and features designed specifically for healthcare professionals, 
            researchers, and medical students. Everything you need to advance your medical career in one platform.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-lg border ${getColorClasses(feature.color)}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900 font-medium">All features are HIPAA-compliant and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
