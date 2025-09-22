
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink, Search, Filter } from 'lucide-react';

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: 'Senior Cardiologist',
      company: 'Metropolitan Hospital',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$250,000 - $350,000',
      posted: '2 days ago',
      description: 'We are seeking an experienced cardiologist to join our team...',
      requirements: ['MD degree', '5+ years experience', 'Board certification'],
      saved: true
    },
    {
      id: 2,
      title: 'Emergency Medicine Physician',
      company: 'City General Hospital',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      salary: '$200,000 - $280,000',
      posted: '1 week ago',
      description: 'Join our emergency department team in a fast-paced environment...',
      requirements: ['MD degree', 'EM residency', 'ACLS certification'],
      saved: false
    },
    {
      id: 3,
      title: 'Medical Research Fellow',
      company: 'University Medical Center',
      location: 'Boston, MA',
      type: 'Fellowship',
      salary: '$60,000 - $80,000',
      posted: '3 days ago',
      description: 'Research opportunity in oncology with leading specialists...',
      requirements: ['MD/PhD preferred', 'Research experience', 'Publications'],
      saved: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="text-gray-600">Discover opportunities in healthcare</p>
          </div>
          <Button>Post a Job</Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search jobs..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ma">Massachusetts</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="emergency">Emergency Medicine</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className={`h-4 w-4 ${job.saved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button>Apply Now</Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">Load More Jobs</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
