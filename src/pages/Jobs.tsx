
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Clock, DollarSign, Plus } from "lucide-react";
import { jobsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Jobs = () => {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary_range: "",
    job_type: "full-time",
    experience_level: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsAPI.getJobs,
  });

  const createJobMutation = useMutation({
    mutationFn: jobsAPI.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setNewJob({
        title: "",
        company: "",
        description: "",
        location: "",
        salary_range: "",
        job_type: "full-time",
        experience_level: "",
      });
      setShowCreateJob(false);
      toast({
        title: "Success",
        description: "Job posted successfully!",
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

  const applyJobMutation = useMutation({
    mutationFn: ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) =>
      jobsAPI.applyForJob(jobId, coverLetter),
    onSuccess: () => {
      setShowApplyDialog(false);
      setCoverLetter("");
      setSelectedJob(null);
      toast({
        title: "Success",
        description: "Application submitted successfully!",
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

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(newJob);
  };

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
  };

  const submitApplication = () => {
    if (selectedJob) {
      applyJobMutation.mutate({
        jobId: selectedJob.id,
        coverLetter: coverLetter.trim() || undefined,
      });
    }
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
          <h1 className="text-3xl font-bold">Medical Jobs</h1>
          <Dialog open={showCreateJob} onOpenChange={setShowCreateJob}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Cardiologist"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Hospital</Label>
                    <Input
                      id="company"
                      value={newJob.company}
                      onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g. City Hospital"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, requirements, and responsibilities..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newJob.location}
                      onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input
                      id="salary"
                      value={newJob.salary_range}
                      onChange={(e) => setNewJob(prev => ({ ...prev, salary_range: e.target.value }))}
                      placeholder="e.g. $150,000 - $200,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select value={newJob.job_type} onValueChange={(value) => setNewJob(prev => ({ ...prev, job_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="locum">Locum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Input
                      id="experience"
                      value={newJob.experience_level}
                      onChange={(e) => setNewJob(prev => ({ ...prev, experience_level: e.target.value }))}
                      placeholder="e.g. 3-5 years"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={createJobMutation.isPending}>
                  {createJobMutation.isPending ? "Posting..." : "Post Job"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {jobs?.map((job: any) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {job.company}
                      </span>
                      {job.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.job_type}
                    </Badge>
                    {job.salary_range && (
                      <Badge variant="outline">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {job.salary_range}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Posted by {job.profiles?.first_name} {job.profiles?.last_name}
                    {job.experience_level && ` • Experience: ${job.experience_level}`}
                  </div>
                  <Button onClick={() => handleApply(job)}>
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!jobs || jobs.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No jobs posted yet.</p>
              <Button onClick={() => setShowCreateJob(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post First Job
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Apply Dialog */}
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
                <Textarea
                  id="cover_letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell them why you're interested in this position..."
                  rows={6}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={submitApplication} disabled={applyJobMutation.isPending}>
                  {applyJobMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
                <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
