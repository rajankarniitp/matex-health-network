
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Edit,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Award,
  BookOpen,
  Users,
  Eye,
  FileText,
  Upload,
  Plus,
  ExternalLink,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Cardiologist',
    specialization: 'Interventional Cardiology',
    location: 'New York, NY',
    bio: 'Board-certified cardiologist with 10+ years of experience in interventional cardiology. Passionate about advancing cardiac care through innovative techniques and research.',
    education: 'MD from Harvard Medical School',
    experience: 'Senior Cardiologist at Mount Sinai Hospital',
    joinDate: 'January 2022',
    verified: true
  });

  const stats = [
    { label: 'Profile Views', value: '1,234', icon: Eye },
    { label: 'Mates', value: '567', icon: Users },
    { label: 'Posts', value: '89', icon: FileText },
    { label: 'Research Papers', value: '23', icon: BookOpen },
  ];

  const certifications = [
    { name: 'Board Certification in Cardiology', issuer: 'American Board of Internal Medicine', year: '2015' },
    { name: 'Advanced Cardiac Life Support (ACLS)', issuer: 'American Heart Association', year: '2023' },
    { name: 'Interventional Cardiology Fellowship', issuer: 'Mayo Clinic', year: '2014' },
  ];

  const publications = [
    {
      title: 'Minimally Invasive Approaches in Cardiac Surgery: A Comprehensive Review',
      journal: 'Journal of Cardiothoracic Surgery',
      year: '2023',
      citations: 45,
      link: '#'
    },
    {
      title: 'Novel Techniques in Percutaneous Coronary Intervention',
      journal: 'American Journal of Cardiology',
      year: '2022',
      citations: 67,
      link: '#'
    },
    {
      title: 'Patient Outcomes in Emergency Cardiac Procedures',
      journal: 'Emergency Medicine International',
      year: '2022',
      citations: 32,
      link: '#'
    },
  ];

  const recentActivity = [
    { type: 'post', content: 'Shared insights on minimally invasive cardiac procedures', time: '2 hours ago' },
    { type: 'research', content: 'Published new research paper on cardiac surgery techniques', time: '1 day ago' },
    { type: 'mate', content: 'Connected with Dr. Sarah Johnson', time: '2 days ago' },
    { type: 'event', content: 'Attended International Cardiology Conference', time: '1 week ago' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={profileData.name} />
                  <AvatarFallback className="text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                      {profileData.verified && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-600">{profileData.role}</p>
                    <p className="text-sm text-gray-500">{profileData.specialization}</p>
                  </div>
                  
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "default" : "outline"}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <Input
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <Input
                          value={profileData.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                      <Input
                        value={profileData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <Input
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
                      <p className="text-gray-700">{profileData.bio}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{profileData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{profileData.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Details</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Education:</span>
                            <p className="text-gray-700">{profileData.education}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Current Position:</span>
                            <p className="text-gray-700">{profileData.experience}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Research Publications</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Publication
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publications.map((pub, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{pub.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{pub.journal} • {pub.year}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>{pub.citations} citations</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Certifications & Credentials</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-600">Issued by {cert.issuer}</p>
                          <p className="text-sm text-gray-500">Year: {cert.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 py-3 border-b last:border-b-0">
                      <div className="bg-gray-100 rounded-full p-2">
                        {activity.type === 'post' && <FileText className="h-4 w-4 text-gray-600" />}
                        {activity.type === 'research' && <BookOpen className="h-4 w-4 text-gray-600" />}
                        {activity.type === 'mate' && <Users className="h-4 w-4 text-gray-600" />}
                        {activity.type === 'event' && <Calendar className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.content}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
