
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, MessageCircle, Check, X, Search } from "lucide-react";
import { connectionsAPI, userAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Mates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: connectionsAPI.getConnections,
  });

  const { data: allProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['all-profiles'],
    queryFn: userAPI.getAllProfiles,
  });

  const sendRequestMutation = useMutation({
    mutationFn: connectionsAPI.sendConnectionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast({
        title: "Success",
        description: "Connection request sent!",
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

  const updateConnectionMutation = useMutation({
    mutationFn: ({ connectionId, status }: { connectionId: string; status: string }) =>
      connectionsAPI.updateConnectionStatus(connectionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast({
        title: "Success",
        description: "Connection updated!",
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

  const handleSendRequest = (addresseeId: string) => {
    sendRequestMutation.mutate(addresseeId);
  };

  const handleAcceptRequest = (connectionId: string) => {
    updateConnectionMutation.mutate({ connectionId, status: 'accepted' });
  };

  const handleRejectRequest = (connectionId: string) => {
    updateConnectionMutation.mutate({ connectionId, status: 'rejected' });
  };

  // Filter connections based on user's perspective
  const pendingRequests = connections?.filter(conn => 
    conn.status === 'pending' && conn.addressee_id === user?.id
  ) || [];

  const sentRequests = connections?.filter(conn => 
    conn.status === 'pending' && conn.requester_id === user?.id
  ) || [];

  const acceptedConnections = connections?.filter(conn => 
    conn.status === 'accepted'
  ) || [];

  // Get connection IDs to filter out from discover
  const connectionUserIds = new Set([
    ...connections?.map(conn => conn.requester_id) || [],
    ...connections?.map(conn => conn.addressee_id) || [],
    user?.id || ''
  ]);

  const availableProfiles = allProfiles?.filter(profile => 
    !connectionUserIds.has(profile.id) &&
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (connectionsLoading || profilesLoading) {
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
        <h1 className="text-3xl font-bold">Medical Mates</h1>
        
        <Tabs defaultValue="discover" className="space-y-4">
          <TabsList>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="requests">
              Requests 
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="connections">My Mates ({acceptedConnections.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medical professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableProfiles.map((profile: any) => (
                <Card key={profile.id}>
                  <CardHeader className="text-center">
                    <Avatar className="mx-auto h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {profile.first_name} {profile.last_name}
                    </CardTitle>
                    <CardDescription>{profile.specialization || 'Medical Professional'}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    {profile.location && (
                      <p className="text-sm text-gray-500">{profile.location}</p>
                    )}
                    <Button 
                      onClick={() => handleSendRequest(profile.id)}
                      disabled={sendRequestMutation.isPending}
                      className="w-full"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {availableProfiles.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No new professionals to connect with.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending Requests</h3>
              {pendingRequests.map((connection: any) => (
                <Card key={connection.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {connection.requester_profile?.first_name?.[0]}
                          {connection.requester_profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {connection.requester_profile?.first_name} {connection.requester_profile?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {connection.requester_profile?.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(connection.id)}
                        disabled={updateConnectionMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(connection.id)}
                        disabled={updateConnectionMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sentRequests.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-8">Sent Requests</h3>
                  {sentRequests.map((connection: any) => (
                    <Card key={connection.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {connection.addressee_profile?.first_name?.[0]}
                              {connection.addressee_profile?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {connection.addressee_profile?.first_name} {connection.addressee_profile?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {connection.addressee_profile?.specialization}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {pendingRequests.length === 0 && sentRequests.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">No pending requests.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {acceptedConnections.map((connection: any) => {
                const isRequester = connection.requester_id === user?.id;
                const profile = isRequester ? connection.addressee_profile : connection.requester_profile;
                
                return (
                  <Card key={connection.id}>
                    <CardHeader className="text-center">
                      <Avatar className="mx-auto h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">
                        {profile?.first_name} {profile?.last_name}
                      </CardTitle>
                      <CardDescription>{profile?.specialization || 'Medical Professional'}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {acceptedConnections.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No connections yet. Start discovering new mates!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Mates;
