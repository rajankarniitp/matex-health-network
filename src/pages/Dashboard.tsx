
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('docmatex_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = localStorage.getItem('docmatex_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const stats = [
    { name: 'My Mates', value: '234', icon: Users, color: 'blue', change: '+12%' },
    { name: 'Profile Views', value: '1,234', icon: Eye, color: 'green', change: '+8%' },
    { name: 'Posts', value: '45', icon: MessageSquare, color: 'purple', change: '+3%' },
    { name: 'Research Papers', value: '12', icon: FileText, color: 'orange', change: '+2%' },
  ];

  const recentPosts = [
    {
      id: 1,
      author: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      time: '2 hours ago',
      content: 'Just published a new research paper on minimally invasive cardiac surgery techniques. The results are promising!',
      likes: 24,
      comments: 8,
      shares: 5,
      verified: true
    },
    {
      id: 2,
      author: 'Dr. Michael Chen',
      role: 'Neurologist',
      time: '4 hours ago',
      content: 'Attending the International Neuroscience Conference next week. Looking forward to the latest developments in brain research.',
      likes: 18,
      comments: 12,
      shares: 3,
      verified: true
    },
    {
      id: 3,
      author: 'Dr. Priya Patel',
      role: 'Pediatrician',
      time: '1 day ago',
      content: 'Successfully completed a complex pediatric surgery today. Teamwork and preparation made all the difference.',
      likes: 45,
      comments: 15,
      shares: 8,
      verified: true
    },
  ];

  const suggestions = [
    { name: 'Dr. Robert Wilson', role: 'Orthopedic Surgeon', mutualMates: 12, verified: true },
    { name: 'Dr. Lisa Thompson', role: 'Dermatologist', mutualMates: 8, verified: true },
    { name: 'Dr. James Martinez', role: 'Emergency Medicine', mutualMates: 15, verified: true },
  ];

  const upcomingEvents = [
    { title: 'Medical Innovation Summit', date: 'Dec 15, 2024', type: 'Conference' },
    { title: 'Cardiology Webinar', date: 'Dec 18, 2024', type: 'Webinar' },
    { title: 'Research Methodology Workshop', date: 'Dec 22, 2024', type: 'Workshop' },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100">
            Stay connected with the latest in healthcare and expand your professional network.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.name}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg bg-${item.color}-100`}>
                    <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                      <span className={`ml-2 text-sm font-medium text-${item.color}-600`}>
                        {item.change}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/feed')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={post.author} />
                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{post.author}</p>
                          {post.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.role} • {post.time}</p>
                        <p className="mt-2 text-sm text-gray-700">{post.content}</p>
                        <div className="mt-3 flex items-center space-x-6">
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => navigate('/feed')}>
                  View All Posts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mate Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">People You May Know</CardTitle>
                <CardDescription>Expand your professional network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((person, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={person.name} />
                      <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                        {person.verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{person.role}</p>
                      <p className="text-xs text-gray-400">{person.mutualMates} mutual mates</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Connect
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" onClick={() => navigate('/search')}>
                  Find More Professionals
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Don't miss these medical events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.date}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" onClick={() => navigate('/events')}>
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/research')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Share Research
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/case-studies')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Add Case Study
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/jobs')}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/mentorship')}>
                  <Award className="h-4 w-4 mr-2" />
                  Find Mentor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
