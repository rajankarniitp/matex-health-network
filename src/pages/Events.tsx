
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ExternalLink, Filter } from 'lucide-react';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'International Cardiology Conference 2024',
      date: 'March 15-17, 2024',
      time: '9:00 AM - 6:00 PM',
      location: 'New York Convention Center',
      type: 'Conference',
      attendees: 1250,
      price: '$599',
      description: 'Join leading cardiologists from around the world for the latest in cardiac care...',
      tags: ['Cardiology', 'CME Credits', 'Networking'],
      organizer: 'American Heart Association',
      isVirtual: false,
      registered: false
    },
    {
      id: 2,
      title: 'Emergency Medicine Webinar: Trauma Care',
      date: 'March 20, 2024',
      time: '2:00 PM - 4:00 PM EST',
      location: 'Online',
      type: 'Webinar',
      attendees: 500,
      price: 'Free',
      description: 'Learn the latest protocols in trauma care and emergency response...',
      tags: ['Emergency Medicine', 'Trauma', 'Free CME'],
      organizer: 'Emergency Medicine Society',
      isVirtual: true,
      registered: true
    },
    {
      id: 3,
      title: 'Pediatric Surgery Workshop',
      date: 'April 5, 2024',
      time: '10:00 AM - 5:00 PM',
      location: 'Children\'s Hospital Boston',
      type: 'Workshop',
      attendees: 50,
      price: '$299',
      description: 'Hands-on workshop covering minimally invasive pediatric surgical techniques...',
      tags: ['Pediatrics', 'Surgery', 'Hands-on'],
      organizer: 'Pediatric Surgery Association',
      isVirtual: false,
      registered: false
    }
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: 'AI in Medicine Summit',
      date: 'May 10, 2024',
      type: 'Summit',
      isVirtual: true
    },
    {
      id: 5,
      title: 'Oncology Research Symposium',
      date: 'May 25, 2024',
      type: 'Symposium',
      isVirtual: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Events</h1>
            <p className="text-gray-600">Conferences, webinars, and continuing education</p>
          </div>
          <Button>Create Event</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 flex-wrap">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                All Events
              </Button>
              <Button variant="outline">Conferences</Button>
              <Button variant="outline">Webinars</Button>
              <Button variant="outline">Workshops</Button>
              <Button variant="outline">CME Credits</Button>
              <Button variant="outline">Free Events</Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Events */}
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <Badge variant={event.isVirtual ? 'secondary' : 'default'}>
                        {event.isVirtual ? 'Virtual' : 'In-Person'}
                      </Badge>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{event.organizer}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attendees
                      </div>
                      <div className="font-semibold text-green-600">
                        {event.price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {event.registered ? (
                    <Button variant="outline">
                      Registered ✓
                    </Button>
                  ) : (
                    <Button>
                      Register Now
                    </Button>
                  )}
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Don't miss these upcoming medical events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{event.date}</span>
                      <Badge variant={event.isVirtual ? 'secondary' : 'default'} className="text-xs">
                        {event.isVirtual ? 'Virtual' : 'In-Person'}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Events */}
        <Card>
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Events you've registered for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div>
                  <h4 className="font-semibold">Emergency Medicine Webinar: Trauma Care</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>March 20, 2024</span>
                    <Badge variant="secondary" className="text-xs">Virtual</Badge>
                    <span className="text-green-600 font-medium">Registered</span>
                  </div>
                </div>
                <Button size="sm">Join Event</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Events;
