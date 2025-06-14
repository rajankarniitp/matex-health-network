
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, MessageCircle, Users, UserMinus, Search, Filter, MapPin, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Mates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [mates, setMates] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      location: 'New York, USA',
      mutualMates: 12,
      verified: true,
      status: 'connected',
      avatar: 'SJ',
      bio: 'Interventional Cardiologist with 15+ years experience',
      institution: 'Mount Sinai Hospital'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      location: 'Toronto, Canada',
      mutualMates: 8,
      verified: true,
      status: 'connected',
      avatar: 'MC',
      bio: 'Neurosurgeon specializing in brain tumor surgery',
      institution: 'Toronto General Hospital'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      location: 'London, UK',
      mutualMates: 15,
      verified: true,
      status: 'pending',
      avatar: 'ER',
      bio: 'Emergency physician and trauma specialist',
      institution: 'St. Bartholomew\'s Hospital'
    },
    {
      id: 4,
      name: 'Dr. Priya Patel',
      specialization: 'Pediatrics',
      location: 'Mumbai, India',
      mutualMates: 22,
      verified: true,
      status: 'connected',
      avatar: 'PP',
      bio: 'Pediatric surgeon with expertise in congenital disorders',
      institution: 'Tata Memorial Hospital'
    }
  ]);

  const [suggestions, setSuggestions] = useState([
    {
      id: 5,
      name: 'Dr. David Kim',
      specialization: 'Orthopedic Surgery',
      location: 'Seoul, South Korea',
      mutualMates: 5,
      verified: true,
      avatar: 'DK',
      bio: 'Sports medicine and joint replacement specialist',
      institution: 'Samsung Medical Center'
    },
    {
      id: 6,
      name: 'Dr. Anna Petrov',
      specialization: 'Pediatrics',
      location: 'Moscow, Russia',
      mutualMates: 3,
      verified: true,
      avatar: 'AP',
      bio: 'Pediatric oncologist and researcher',
      institution: 'Moscow Institute of Pediatrics'
    },
    {
      id: 7,
      name: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      location: 'Sydney, Australia',
      mutualMates: 7,
      verified: true,
      avatar: 'JW',
      bio: 'Spine surgery and orthopedic trauma specialist',
      institution: 'Royal Prince Alfred Hospital'
    },
    {
      id: 8,
      name: 'Dr. Maria Santos',
      specialization: 'Dermatology',
      location: 'São Paulo, Brazil',
      mutualMates: 4,
      verified: true,
      avatar: 'MS',
      bio: 'Dermatopathologist and cosmetic dermatologist',
      institution: 'Hospital das Clínicas'
    }
  ]);

  const handleRemoveMate = (mateId: number) => {
    setMates(mates.filter(mate => mate.id !== mateId));
    toast({
      title: "Mate removed",
      description: "You have successfully removed this mate from your network.",
    });
  };

  const handleSendRequest = (suggestionId: number) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const newMate = { ...suggestion, status: 'pending' };
      setMates([...mates, newMate]);
      setSuggestions(suggestions.filter(s => s.id !== suggestionId));
      toast({
        title: "Mate request sent",
        description: `Your mate request has been sent to ${suggestion.name}.`,
      });
    }
  };

  const filteredMates = mates.filter(mate => {
    const matchesSearch = mate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mate.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mate.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialization === 'all' || mate.specialization === filterSpecialization;
    return matchesSearch && matchesFilter;
  });

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch = suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suggestion.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialization === 'all' || suggestion.specialization === filterSpecialization;
    return matchesSearch && matchesFilter;
  });

  const specializations = ['all', 'Cardiology', 'Neurology', 'Emergency Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Orthopedic Surgery'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Medical Mates</h1>
            <p className="text-gray-600">Connect with healthcare professionals worldwide</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Find New Mates
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by name, specialization, or location..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>
                      {spec === 'all' ? 'All Specializations' : spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{mates.filter(m => m.status === 'connected').length}</div>
                  <p className="text-gray-600">Active Mates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{mates.filter(m => m.status === 'pending').length}</div>
                  <p className="text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-gray-600">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-gray-600">Mutual Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Mates */}
        <Card>
          <CardHeader>
            <CardTitle>My Mates ({filteredMates.length})</CardTitle>
            <CardDescription>Healthcare professionals in your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMates.map((mate) => (
                <div key={mate.id} className="border rounded-lg p-6 hover:shadow-md transition-all hover:border-blue-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" alt={mate.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {mate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{mate.name}</h3>
                        {mate.verified && <Badge variant="secondary" className="text-xs bg-green-100 text-green-600">✓</Badge>}
                      </div>
                      <p className="text-sm font-medium text-blue-600">{mate.specialization}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {mate.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{mate.bio}</p>
                    <p className="text-xs text-gray-500">{mate.institution}</p>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    {mate.mutualMates} mutual mates
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRemoveMate(mate.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserMinus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {mate.status === 'pending' && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        Request Pending
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Mates ({filteredSuggestions.length})</CardTitle>
            <CardDescription>Healthcare professionals you might know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-6 hover:shadow-md transition-all hover:border-blue-200">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="" alt={suggestion.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                        {suggestion.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                        {suggestion.verified && <Badge variant="secondary" className="text-xs bg-green-100 text-green-600">✓</Badge>}
                      </div>
                      <p className="text-sm font-medium text-blue-600">{suggestion.specialization}</p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {suggestion.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">{suggestion.bio}</p>
                    <p className="text-xs text-gray-500">{suggestion.institution}</p>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    {suggestion.mutualMates} mutual mates
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSendRequest(suggestion.id)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Send Mate Request
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Mates;
