
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Research Hub</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Discover and share medical research</p>
          </div>
          <Button className="w-full sm:w-auto text-sm">
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Upload Research
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <Input 
                  placeholder="Search research papers..." 
                  className="pl-8 sm:pl-10 text-sm h-8 sm:h-10" 
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Filter</Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">Sort</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Research */}
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-lg sm:text-xl">Featured Research</CardTitle>
            <CardDescription className="text-sm">Trending papers in the medical community</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="space-y-4 sm:space-y-6">
              {papers.map((paper) => (
                <div key={paper.id} className="border rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold hover:text-blue-600 cursor-pointer line-clamp-2">
                          {paper.title}
                        </h3>
                        <Badge variant={paper.type === 'free' ? 'default' : 'secondary'} className="text-xs w-fit">
                          {paper.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                        {paper.authors.map((author, index) => (
                          <span key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {author}{index < paper.authors.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                        {paper.journal} • {paper.year}
                      </p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-none">{paper.abstract}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {paper.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{paper.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{paper.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{paper.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{paper.comments}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-none">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Preview</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-none">
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                        <Share className="h-3 w-3 sm:h-4 sm:w-4" />
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
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <CardTitle className="text-lg sm:text-xl">My Research</CardTitle>
            <CardDescription className="text-sm">Papers you've authored or co-authored</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm sm:text-base mb-3 sm:mb-4">You haven't uploaded any research papers yet.</p>
              <Button className="text-sm">Upload Your First Paper</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Research;
