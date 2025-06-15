
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
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Mentorship
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                Connect with mentors and guide the next generation of healthcare professionals
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto bg-background border-border hover:bg-muted text-foreground"
              >
                Become a Mentor
              </Button>
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Find a Mentor
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    1,250
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Active Mentors
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    3,450
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Mentees
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    15,600
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Hours Mentored
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-400" />
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    4.8
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Average Rating
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Mentorships Section */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-foreground">
                My Mentorships
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Your active mentoring relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myMentorships.map((relationship) => (
                <div 
                  key={relationship.id} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-4 sm:gap-6"
                >
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-border">
                      <AvatarImage src="" alt={relationship.mentor || relationship.mentee} />
                      <AvatarFallback className="text-sm sm:text-base font-semibold bg-primary text-primary-foreground">
                        {(relationship.mentor || relationship.mentee || '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {relationship.mentor || relationship.mentee}
                        </h3>
                        <div className="flex gap-2">
                          <Badge 
                            variant={relationship.type === 'Mentor' ? 'default' : 'secondary'}
                            className="text-xs font-medium"
                          >
                            {relationship.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="text-xs font-medium text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                          >
                            {relationship.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Next session: {relationship.nextSession}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 sm:flex-none bg-background border-border hover:bg-muted text-foreground"
                    >
                      <MessageCircle className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Message</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Schedule</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Available Mentors Section */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-foreground">
                Find a Mentor
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Connect with experienced healthcare professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {mentors.map((mentor) => (
                  <div 
                    key={mentor.id} 
                    className="border border-border rounded-lg p-4 sm:p-6 bg-muted/30 hover:bg-muted/50 hover:shadow-md transition-all duration-200 space-y-4"
                  >
                    {/* Mentor Header */}
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-border">
                        <AvatarImage src="" alt={mentor.name} />
                        <AvatarFallback className="text-sm sm:text-base font-semibold bg-primary text-primary-foreground">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {mentor.specialization}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {mentor.location}
                        </p>
                      </div>
                    </div>

                    {/* Mentor Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium text-foreground">{mentor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">{mentor.rating}</span>
                          <span className="text-muted-foreground">({mentor.reviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium text-foreground">{mentor.hourlyRate}/hour</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium text-foreground">{mentor.students}</span>
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Expertise:</h4>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="text-xs bg-background border-border text-foreground hover:bg-muted"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Availability and Actions */}
                    <div className="space-y-3">
                      <Badge 
                        variant={mentor.availability === 'Available' ? 'default' : 'secondary'}
                        className={`w-fit ${mentor.availability === 'Available' 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {mentor.availability}
                      </Badge>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                        >
                          Request Mentorship
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-background border-border hover:bg-muted text-foreground"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Become a Mentor Section */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl text-foreground">
                Share Your Knowledge
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Help shape the future of healthcare by becoming a mentor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 sm:py-8 space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 sm:p-6">
                    <Award className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                    Become a Mentor
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Share your expertise with the next generation of healthcare professionals. 
                    Set your own schedule, choose your mentees, and make a lasting impact on medical education.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Apply to be a Mentor
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto bg-background border-border hover:bg-muted text-foreground"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Mentorship;
