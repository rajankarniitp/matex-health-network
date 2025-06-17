
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, MessageCircle, Users, UserMinus, Search, Filter, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Mates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleRemoveMate = async (mateId: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMates(mates.filter(mate => mate.id !== mateId));
      toast({
        title: "Connection Removed",
        description: "You have successfully removed this mate from your network.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove mate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (suggestionId: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        const newMate = { ...suggestion, status: 'pending' };
        setMates([...mates, newMate]);
        setSuggestions(suggestions.filter(s => s.id !== suggestionId));
        toast({
          title: "Request Sent",
          description: `Your connection request has been sent to ${suggestion.name}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Medical Network</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Connect with healthcare professionals worldwide</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 w-full sm:w-auto transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]">
            <UserPlus className="h-4 w-4 mr-2" />
            Find New Colleagues
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by name, specialization, or location..." 
                  className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {spec === 'all' ? 'All Specializations' : spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mates.filter(m => m.status === 'connected').length}</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{mates.filter(m => m.status === 'pending').length}</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">47</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">156</div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Mutual Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Connections */}
        <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">My Connections ({filteredMates.length})</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Healthcare professionals in your network</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {filteredMates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No connections found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or connect with new colleagues.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredMates.map((mate) => (
                  <div key={mate.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-gray-800">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-gray-100 dark:ring-gray-700">
                        <AvatarImage src="" alt={mate.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 text-blue-700 dark:text-blue-300 text-lg font-semibold">
                          {mate.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{mate.name}</h3>
                          {mate.verified && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2">✓</Badge>}
                        </div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{mate.specialization}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{mate.location}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{mate.bio}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{mate.institution}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {mate.mutualMates} mutual connections
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 min-h-[40px]"
                        disabled={isLoading}
                      >
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemoveMate(mate.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 min-h-[40px] min-w-[40px]"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserMinus className="h-3 w-3" />}
                      </Button>
                    </div>
                    
                    {mate.status === 'pending' && (
                      <div className="mt-3">
                        <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
                          Request Pending
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Connections */}
        <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">Suggested Connections ({filteredSuggestions.length})</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Healthcare professionals you might know</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No suggestions found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria to discover new connections.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-gray-800">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-2 ring-gray-100 dark:ring-gray-700">
                        <AvatarImage src="" alt={suggestion.name} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 text-lg font-semibold">
                          {suggestion.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{suggestion.name}</h3>
                          {suggestion.verified && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2">✓</Badge>}
                        </div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">{suggestion.specialization}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{suggestion.location}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{suggestion.bio}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{suggestion.institution}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {suggestion.mutualMates} mutual connections
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg min-h-[44px]"
                      onClick={() => handleSendRequest(suggestion.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-3 w-3 mr-2" />
                      )}
                      Send Connection Request
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Mates;
