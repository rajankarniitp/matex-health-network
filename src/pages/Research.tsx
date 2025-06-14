
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Download, Eye, Heart, MessageCircle, Share, Upload, Search } from 'lucide-react';

const Research = () => {
  const papers = [
    {
      id: 1,
      title: 'Novel Approaches to Cardiac Surgery in Elderly Patients',
      authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez'],
      journal: 'Journal of Cardiology',
      year: 2024,
      downloads: 245,
      views: 1520,
      likes: 42,
      comments: 12,
      abstract: 'This study explores innovative surgical techniques for treating cardiac conditions in elderly patients...',
      tags: ['Cardiology', 'Surgery', 'Geriatrics'],
      type: 'free'
    },
    {
      id: 2,
      title: 'AI-Driven Diagnostics in Emergency Medicine',
      authors: ['Dr. David Kim', 'Dr. Anna Petrov'],
      journal: 'Emergency Medicine Today',
      year: 2024,
      downloads: 189,
      views: 987,
      likes: 38,
      comments: 8,
      abstract: 'Machine learning algorithms are revolutionizing emergency diagnosis protocols...',
      tags: ['AI', 'Emergency Medicine', 'Diagnostics'],
      type: 'premium'
    },
    {
      id: 3,
      title: 'Pediatric Mental Health in Post-Pandemic Era',
      authors: ['Dr. Lisa Wang', 'Dr. James Miller'],
      journal: 'Pediatric Psychology Review',
      year: 2024,
      downloads: 156,
      views: 742,
      likes: 29,
      comments: 15,
      abstract: 'Analyzing the long-term mental health impacts on children following the global pandemic...',
      tags: ['Pediatrics', 'Mental Health', 'COVID-19'],
      type: 'free'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Hub</h1>
            <p className="text-gray-600">Discover and share medical research</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Research
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search research papers..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Sort</Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Research */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Research</CardTitle>
            <CardDescription>Trending papers in the medical community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {papers.map((paper) => (
                <div key={paper.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                          {paper.title}
                        </h3>
                        <Badge variant={paper.type === 'free' ? 'default' : 'secondary'}>
                          {paper.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {paper.authors.map((author, index) => (
                          <span key={index} className="text-sm text-gray-600">
                            {author}{index < paper.authors.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        {paper.journal} • {paper.year}
                      </p>
                      <p className="text-gray-700 mb-3">{paper.abstract}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {paper.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {paper.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {paper.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {paper.comments}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Research */}
        <Card>
          <CardHeader>
            <CardTitle>My Research</CardTitle>
            <CardDescription>Papers you've authored or co-authored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You haven't uploaded any research papers yet.</p>
              <Button className="mt-4">Upload Your First Paper</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Research;
