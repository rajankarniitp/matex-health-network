import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { userAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSkeleton from '@/components/ui/loading-skeleton';
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

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    specialization: '',
    location: '',
    bio: '',
    verified: false
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching user profile...');
      
      const response = await userAPI.getProfile();
      console.log('Profile response:', response);
      
      if (response.user) {
        const userData = response.user;
        setProfileData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'doctor',
          specialization: userData.specialization || '',
          location: userData.location || '',
          bio: userData.bio || '',
          verified: userData.verified || false
        });
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      
      toast({
        title: "Error Loading Profile",
        description: "Could not load profile data. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      await userAPI.updateProfile(profileData);
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const displayName = profileData.first_name && profileData.last_name 
    ? `${profileData.first_name} ${profileData.last_name}` 
    : profileData.first_name || 'User';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <LoadingSkeleton type="profile" count={1} />
          <LoadingSkeleton type="stats" />
          <LoadingSkeleton type="card" count={2} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="bg-card dark:bg-card border border-border dark:border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <Avatar className="h-24 w-24 ring-2 ring-border dark:ring-border">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                    {displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-foreground">
                        Dr. {displayName}
                      </h1>
                      {profileData.verified && (
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center">
                          <Award className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-medium text-foreground dark:text-foreground">
                      {profileData.role || 'Healthcare Professional'}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {profileData.specialization || 'Medical Specialist'}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(!isEditing)}
                    variant={isEditing ? "default" : "outline"}
                    className="self-start sm:self-auto"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Edit className="h-4 w-4 mr-2" />
                    )}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 text-sm text-muted-foreground dark:text-muted-foreground">
                  {profileData.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined Recently</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card dark:bg-card border border-border dark:border-border">
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground dark:text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="about" className="text-sm font-medium">About</TabsTrigger>
            <TabsTrigger value="publications" className="text-sm font-medium">Publications</TabsTrigger>
            <TabsTrigger value="certifications" className="text-sm font-medium">Certifications</TabsTrigger>
            <TabsTrigger value="activity" className="text-sm font-medium">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card className="bg-card dark:bg-card border border-border dark:border-border">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-foreground">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                          First Name
                        </label>
                        <Input
                          value={profileData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          className="bg-background dark:bg-input text-foreground dark:text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                          Last Name
                        </label>
                        <Input
                          value={profileData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          className="bg-background dark:bg-input text-foreground dark:text-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                        Bio
                      </label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="bg-background dark:bg-input text-foreground dark:text-foreground"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                          Phone
                        </label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-background dark:bg-input text-foreground dark:text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                          Location
                        </label>
                        <Input
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="bg-background dark:bg-input text-foreground dark:text-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                          Specialization
                        </label>
                        <Input
                          value={profileData.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          className="bg-background dark:bg-input text-foreground dark:text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-3">
                        Bio
                      </h3>
                      <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">
                        {profileData.bio || 'No bio available.'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-3">
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
                            <span className="text-muted-foreground dark:text-muted-foreground">
                              {profileData.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
                            <span className="text-muted-foreground dark:text-muted-foreground">
                              {profileData.phone || 'Not provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-3">
                          Professional Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                              Role:
                            </span>
                            <p className="text-foreground dark:text-foreground">
                              {profileData.role || 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                              Specialization:
                            </span>
                            <p className="text-foreground dark:text-foreground">
                              {profileData.specialization || 'Not specified'}
                            </p>
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
            <Card className="bg-card dark:bg-card border border-border dark:border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground dark:text-foreground">Research Publications</CardTitle>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Publication
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publications.map((pub, index) => (
                    <div key={index} className="border border-border dark:border-border rounded-lg p-4 hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground dark:text-foreground mb-2">
                            {pub.title}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-2">
                            {pub.journal} • {pub.year}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground dark:text-muted-foreground">
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
            <Card className="bg-card dark:bg-card border border-border dark:border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground dark:text-foreground">Certifications & Credentials</CardTitle>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border border-border dark:border-border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                          <Award className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground dark:text-foreground">
                            {cert.name}
                          </h3>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            Issued by {cert.issuer}
                          </p>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                            Year: {cert.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-card dark:bg-card border border-border dark:border-border">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 py-3 border-b border-border dark:border-border last:border-b-0">
                      <div className="bg-muted dark:bg-muted rounded-full p-2">
                        {activity.type === 'post' && <FileText className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />}
                        {activity.type === 'research' && <BookOpen className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />}
                        {activity.type === 'mate' && <Users className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />}
                        {activity.type === 'event' && <Calendar className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground dark:text-foreground">
                          {activity.content}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                          {activity.time}
                        </p>
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
