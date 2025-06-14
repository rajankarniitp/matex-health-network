
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Calendar,
  Search,
  Award,
  Brain
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Mate System',
    description: 'Connect with healthcare professionals through our unique Mate system. Build meaningful professional relationships.',
    color: 'blue'
  },
  {
    icon: MessageSquare,
    title: 'Discussion Forums',
    description: 'Engage in medical discussions, share insights, and collaborate on complex cases with peers worldwide.',
    color: 'green'
  },
  {
    icon: FileText,
    title: 'Case Studies',
    description: 'Share and analyze clinical cases. Learn from real-world scenarios and contribute to medical knowledge.',
    color: 'purple'
  },
  {
    icon: Briefcase,
    title: 'Job Board',
    description: 'Discover career opportunities, internships, and positions tailored for healthcare professionals.',
    color: 'orange'
  },
  {
    icon: BookOpen,
    title: 'Research Hub',
    description: 'Access and publish medical research, papers, and studies. Collaborate with researchers globally.',
    color: 'red'
  },
  {
    icon: Calendar,
    title: 'Medical Events',
    description: 'Stay updated with conferences, webinars, CMEs, and workshops. Never miss important medical events.',
    color: 'indigo'
  },
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Find professionals by specialization, location, and interests. AI-powered recommendations.',
    color: 'teal'
  },
  {
    icon: Award,
    title: 'Mentorship',
    description: 'Connect with experienced mentors or guide the next generation of healthcare professionals.',
    color: 'pink'
  },
  {
    icon: Brain,
    title: 'Doxy AI Assistant',
    description: 'Get AI-powered insights, medical information, and assistance for your professional queries.',
    color: 'cyan'
  }
];

const Features = () => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      teal: 'bg-teal-100 text-teal-600',
      pink: 'bg-pink-100 text-pink-600',
      cyan: 'bg-cyan-100 text-cyan-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything You Need for Your Medical Career
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            DocMateX provides comprehensive tools and features designed specifically for healthcare professionals, 
            researchers, and medical students.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-lg ${getColorClasses(feature.color)}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
