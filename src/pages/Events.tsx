
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { eventsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const Events = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date_time: "",
    location: "",
    max_participants: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventsAPI.getEvents,
  });

  const createEventMutation = useMutation({
    mutationFn: eventsAPI.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setNewEvent({
        title: "",
        description: "",
        date_time: "",
        location: "",
        max_participants: "",
      });
      setShowCreateEvent(false);
      toast({
        title: "Success",
        description: "Event created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerEventMutation = useMutation({
    mutationFn: eventsAPI.registerForEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Success",
        description: "Successfully registered for event!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      ...newEvent,
      max_participants: newEvent.max_participants ? parseInt(newEvent.max_participants) : undefined,
    };
    createEventMutation.mutate(eventData);
  };

  const handleRegister = (eventId: string) => {
    registerEventMutation.mutate(eventId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Medical Events</h1>
          <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Cardiology Conference 2024"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event, agenda, speakers..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_time">Date & Time</Label>
                    <Input
                      id="date_time"
                      type="datetime-local"
                      value={newEvent.date_time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Medical Center Auditorium"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="max_participants">Max Participants (Optional)</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={newEvent.max_participants}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, max_participants: e.target.value }))}
                    placeholder="e.g. 100"
                  />
                </div>

                <Button type="submit" disabled={createEventMutation.isPending}>
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {events?.map((event: any) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(event.date_time), "PPP 'at' p")}
                      </span>
                      {event.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {event.max_participants && (
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        Max {event.max_participants}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {event.event_registrations?.[0]?.count || 0} registered
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Organized by {event.profiles?.first_name} {event.profiles?.last_name}
                  </div>
                  <Button 
                    onClick={() => handleRegister(event.id)}
                    disabled={registerEventMutation.isPending}
                  >
                    {registerEventMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!events || events.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No events scheduled yet.</p>
              <Button onClick={() => setShowCreateEvent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Events;
