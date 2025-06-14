
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Calendar, MessageCircle, Users, Award, Clock } from 'lucide-react';

const Mentorship = () => {
  const mentors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      experience: '15 years',
      rating: 4.9,
      reviews: 28,
      hourlyRate: '$150',
      location: 'New York, NY',
      expertise: ['Heart Surgery', 'Interventional Cardiology', 'Clinical Research'],
      availability: 'Available',
      students: 15
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      experience: '12 years',
      rating: 4.8,
      reviews: 22,
      hourlyRate: '$120',
      location: 'Toronto, Canada',
      expertise: ['Stroke Care', 'Epilepsy', 'Neuroimaging'],
      availability: 'Busy',
      students: 8
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      experience: '10 years',
      rating: 4.9,
      reviews: 35,
      hourlyRate: '$100',
      location: 'London, UK',
      expertise: ['Trauma Care', 'Critical Care', 'Emergency Procedures'],
      availability: 'Available',
      students: 12
    }
  ];

  const myMentorships = [
    {
      id: 1,
      mentor: 'Dr. Sarah Johnson',
      type: 'Mentor',
      nextSession: 'March 15, 2024 at 2:00 PM',
      status: 'Active'
    },
    {
      id: 2,
      mentee: 'Dr. John Smith',
      type: 'Mentee',
      nextSession: 'March 18, 2024 at 10:00 AM',
      status: 'Active'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mentorship</h1>
            <p className="text-gray-600">Connect with mentors and guide the next generation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Become a Mentor</Button>
            <Button>Find a Mentor</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">1,250</div>
                  <p className="text-gray-600">Active Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">3,450</div>
                  <p className="text-gray-600">Mentees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">15,600</div>
                  <p className="text-gray-600">Hours Mentored</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Mentorships */}
        <Card>
          <CardHeader>
            <CardTitle>My Mentorships</CardTitle>
            <CardDescription>Your active mentoring relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myMentorships.map((relationship) => (
                <div key={relationship.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="" alt={relationship.mentor || relationship.mentee} />
                      <AvatarFallback>
                        {(relationship.mentor || relationship.mentee || '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{relationship.mentor || relationship.mentee}</h3>
                        <Badge variant={relationship.type === 'Mentor' ? 'default' : 'secondary'}>
                          {relationship.type}
                        </Badge>
                        <Badge variant="outline" className="text-green-600">
                          {relationship.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Next session: {relationship.nextSession}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Mentors */}
        <Card>
          <CardHeader>
            <CardTitle>Find a Mentor</CardTitle>
            <CardDescription>Connect with experienced healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={mentor.name} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{mentor.name}</h3>
                      <p className="text-sm text-gray-600">{mentor.specialization}</p>
                      <p className="text-xs text-gray-500">{mentor.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{mentor.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mentor.rating}</span>
                        <span className="text-gray-500">({mentor.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{mentor.hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{mentor.students}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise:</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={mentor.availability === 'Available' ? 'default' : 'secondary'}
                      className={mentor.availability === 'Available' ? 'bg-green-600' : ''}
                    >
                      {mentor.availability}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Request Mentorship
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Become a Mentor */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Knowledge</CardTitle>
            <CardDescription>Help shape the future of healthcare by becoming a mentor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Award className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Become a Mentor</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Share your expertise with the next generation of healthcare professionals. 
                Set your own schedule, choose your mentees, and make a lasting impact on medical education.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">Apply to be a Mentor</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Mentorship;
