
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink, Search, Filter } from 'lucide-react';
import { useJobs, useApplyJob } from '@/hooks/useApi';
import { useState } from 'react';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  
  const { data: jobs, isLoading } = useJobs({
    location: locationFilter !== 'all' ? locationFilter : undefined,
    specialization: specializationFilter !== 'all' ? specializationFilter : undefined,
  });
  
  const applyJobMutation = useApplyJob();

  const handleApply = (jobId: string) => {
    applyJobMutation.mutate({
      jobId,
      coverLetter: 'I am interested in this position and would like to apply.',
    });
  };

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
                <Input 
                  placeholder="Search jobs..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                </SelectContent>
              </Select>
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Emergency">Emergency Medicine</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
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
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          ) : jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge variant={job.job_type === 'full-time' ? 'default' : 'secondary'}>
                          {job.job_type}
                        </Badge>
                      </div>
                      <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {job.description && (
                    <p className="text-gray-700 mb-4">{job.description}</p>
                  )}

                  {job.experience_level && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Experience Level:</h4>
                      <p className="text-sm text-gray-600">{job.experience_level}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApply(job.id)}
                      disabled={applyJobMutation.isPending}
                    >
                      {applyJobMutation.isPending ? 'Applying...' : 'Apply Now'}
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
            </div>
          )}
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
