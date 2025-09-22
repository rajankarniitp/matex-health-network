
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, Flag, TrendingUp, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Admin = () => {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+8.2%', icon: Users },
    { label: 'Active Users', value: '8,924', change: '+12.1%', icon: Activity },
    { label: 'Pending Reports', value: '23', change: '-15.3%', icon: Flag },
    { label: 'Verified Profiles', value: '11,234', change: '+5.7%', icon: Shield }
  ];

  const pendingUsers = [
    {
      id: 1,
      name: 'Dr. James Wilson',
      email: 'james.wilson@hospital.com',
      specialization: 'Cardiology',
      submittedAt: '2 days ago',
      documents: ['Medical License', 'Board Certification']
    },
    {
      id: 2,
      name: 'Dr. Maria Garcia',
      email: 'maria.garcia@clinic.com',
      specialization: 'Pediatrics',
      submittedAt: '1 day ago',
      documents: ['Medical License', 'Residency Certificate']
    }
  ];

  const reportedContent = [
    {
      id: 1,
      type: 'Post',
      content: 'Inappropriate medical advice without context...',
      reportedBy: 'Dr. Smith',
      reason: 'Misleading medical information',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Comment',
      content: 'Unprofessional language in discussion...',
      reportedBy: 'Dr. Johnson',
      reason: 'Inappropriate language',
      status: 'pending'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, content, and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-gray-600">{stat.label}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>User management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>Review and moderate reported posts and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{report.type}</Badge>
                            <Badge variant="secondary">{report.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Reported by: {report.reportedBy}
                          </p>
                          <p className="text-sm font-medium text-red-600">
                            Reason: {report.reason}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {report.content}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications</CardTitle>
                <CardDescription>Review and approve professional verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="" alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.specialization}</p>
                            <div className="flex gap-2 mt-2">
                              {user.documents.map((doc) => (
                                <Badge key={doc} variant="outline" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Submitted {user.submittedAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Review Documents
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Insights and metrics about platform usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col">
                <Shield className="h-8 w-8 mb-2" />
                <span>Bulk Verify Users</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col">
                <Flag className="h-8 w-8 mb-2" />
                <span>Review Reports</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <span>System Alerts</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col">
                <Activity className="h-8 w-8 mb-2" />
                <span>Platform Health</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
