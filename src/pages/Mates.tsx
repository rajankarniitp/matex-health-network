
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageCircle, Users, UserMinus } from 'lucide-react';

const Mates = () => {
  const mates = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      location: 'New York, USA',
      mutualMates: 12,
      verified: true,
      status: 'connected'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      location: 'Toronto, Canada',
      mutualMates: 8,
      verified: true,
      status: 'connected'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      location: 'London, UK',
      mutualMates: 15,
      verified: true,
      status: 'pending'
    }
  ];

  const suggestions = [
    {
      id: 4,
      name: 'Dr. David Kim',
      specialization: 'Orthopedic Surgery',
      location: 'Seoul, South Korea',
      mutualMates: 5,
      verified: true
    },
    {
      id: 5,
      name: 'Dr. Anna Petrov',
      specialization: 'Pediatrics',
      location: 'Moscow, Russia',
      mutualMates: 3,
      verified: true
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Mates</h1>
            <p className="text-gray-600">Connect with healthcare professionals worldwide</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Find Mates
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-gray-600">Total Mates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-gray-600">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-gray-600">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Mates */}
        <Card>
          <CardHeader>
            <CardTitle>My Mates</CardTitle>
            <CardDescription>Healthcare professionals in your network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mates.map((mate) => (
                <div key={mate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src="" alt={mate.name} />
                      <AvatarFallback>{mate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{mate.name}</h3>
                        {mate.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{mate.specialization}</p>
                      <p className="text-xs text-gray-500">{mate.location}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {mate.mutualMates} mutual mates
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserMinus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Mates</CardTitle>
            <CardDescription>Healthcare professionals you might know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src="" alt={suggestion.name} />
                      <AvatarFallback>{suggestion.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{suggestion.name}</h3>
                        {suggestion.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.specialization}</p>
                      <p className="text-xs text-gray-500">{suggestion.location}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    {suggestion.mutualMates} mutual mates
                  </div>
                  <Button size="sm" className="w-full">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Add Mate
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
