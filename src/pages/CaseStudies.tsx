
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle, Bookmark, Share, Upload, Eye } from 'lucide-react';

const CaseStudies = () => {
  const cases = [
    {
      id: 1,
      title: 'Complex Cardiac Surgery in 78-Year-Old Patient',
      author: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      createdAt: '2 days ago',
      description: 'A challenging case involving multiple comorbidities and innovative surgical approach...',
      tags: ['Cardiac Surgery', 'Geriatrics', 'Complex Case'],
      likes: 24,
      comments: 8,
      views: 156,
      image: null,
      saved: true
    },
    {
      id: 2,
      title: 'Rare Neurological Condition Diagnosis',
      author: 'Dr. Michael Chen',
      specialization: 'Neurology',
      createdAt: '1 week ago',
      description: 'Unusual presentation of a rare neurological disorder that required extensive testing...',
      tags: ['Neurology', 'Rare Disease', 'Diagnosis'],
      likes: 31,
      comments: 12,
      views: 203,
      image: null,
      saved: false
    },
    {
      id: 3,
      title: 'Pediatric Emergency: Airway Management',
      author: 'Dr. Emily Rodriguez',
      specialization: 'Emergency Medicine',
      createdAt: '3 days ago',
      description: 'Critical airway management in a pediatric patient with unexpected complications...',
      tags: ['Pediatrics', 'Emergency', 'Airway Management'],
      likes: 18,
      comments: 6,
      views: 98,
      image: null,
      saved: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Studies</h1>
            <p className="text-gray-600">Share and learn from clinical cases</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Share Case Study
          </Button>
        </div>

        {/* Featured Cases */}
        <div className="space-y-6">
          {cases.map((caseStudy) => (
            <Card key={caseStudy.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src="" alt={caseStudy.author} />
                    <AvatarFallback>{caseStudy.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                        {caseStudy.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{caseStudy.author}</span>
                      <span>•</span>
                      <span>{caseStudy.specialization}</span>
                      <span>•</span>
                      <span>{caseStudy.createdAt}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{caseStudy.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseStudy.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {caseStudy.views}
                        </div>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          {caseStudy.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                          {caseStudy.comments}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Bookmark className={`h-4 w-4 ${caseStudy.saved ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Browse by Specialization</CardTitle>
            <CardDescription>Find cases relevant to your field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Cardiology',
                'Neurology',
                'Emergency Medicine',
                'Pediatrics',
                'Surgery',
                'Internal Medicine',
                'Oncology',
                'Radiology'
              ].map((specialization) => (
                <Button key={specialization} variant="outline" className="h-auto p-4 flex flex-col">
                  <span className="font-medium">{specialization}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {Math.floor(Math.random() * 50) + 10} cases
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Cases */}
        <Card>
          <CardHeader>
            <CardTitle>My Case Studies</CardTitle>
            <CardDescription>Cases you've shared with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You haven't shared any case studies yet.</p>
              <Button className="mt-4">Share Your First Case</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CaseStudies;
