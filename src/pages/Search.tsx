import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, MapPin, Users, FileText, Calendar, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // SEO optimization for search page
  useSEO({
    title: 'Search',
    description: 'Find healthcare professionals, medical research, events, and case studies. Connect with experts in your field of medicine.',
    keywords: 'search doctors, find medical professionals, healthcare experts, medical research search, medical events, case studies',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Search - DocMateX",
      "description": "Find healthcare professionals, medical research, events, and case studies",
      "url": "https://matex-health-network.lovable.app/search",
      "isPartOf": {
        "@type": "WebSite",
        "name": "DocMateX",
        "url": "https://matex-health-network.lovable.app/"
      }
    }
  });

  const searchResults = {
    people: [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        location: 'New York, NY',
        experience: '15 years',
        verified: true,
        mutualMates: 12
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        location: 'Toronto, Canada',
        experience: '8 years',
        verified: true,
        mutualMates: 5
      }
    ],
    research: [
      {
        id: 1,
        title: 'Novel Approaches to Cardiac Surgery',
        authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
        journal: 'Journal of Cardiology',
        year: 2024,
        downloads: 245
      }
    ],
    events: [
      {
        id: 1,
        title: 'International Cardiology Conference 2024',
        date: 'March 15-17, 2024',
        location: 'New York Convention Center',
        attendees: 1250
      }
    ],
    cases: [
      {
        id: 1,
        title: 'Complex Cardiac Surgery in Elderly Patient',
        author: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        likes: 24
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search & Discover</h1>
          <p className="text-gray-600">Find people, research, events, and more</p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for people, research papers, events..."
                className="pl-10 text-lg h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="people">People ({searchResults.people.length})</TabsTrigger>
            <TabsTrigger value="research">Research ({searchResults.research.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({searchResults.events.length})</TabsTrigger>
            <TabsTrigger value="cases">Cases ({searchResults.cases.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Professionals</CardTitle>
                <CardDescription>Connect with doctors, researchers, and medical experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.people.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={person.name} />
                          <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{person.name}</h3>
                            {person.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{person.specialization}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {person.location}
                            </div>
                            <span>{person.experience} experience</span>
                            <span>{person.mutualMates} mutual mates</span>
                          </div>
                        </div>
                      </div>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Mate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="research" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Research Papers</CardTitle>
                <CardDescription>Discover medical research and publications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.research.map((paper) => (
                    <div key={paper.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        {paper.authors.map((author, index) => (
                          <span key={index}>
                            {author}{index < paper.authors.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{paper.journal} • {paper.year}</span>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {paper.downloads} downloads
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medical Events</CardTitle>
                <CardDescription>Conferences, webinars, and educational events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees} attendees
                        </div>
                      </div>
                      <Button className="mt-3" size="sm">Register</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Studies</CardTitle>
                <CardDescription>Clinical cases shared by the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.cases.map((caseStudy) => (
                    <div key={caseStudy.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">
                        {caseStudy.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span>By {caseStudy.author}</span>
                        <span>•</span>
                        <span>{caseStudy.specialization}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {caseStudy.likes} likes
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Filters</CardTitle>
            <CardDescription>Refine your search results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Cardiology</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Neurology</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Emergency Medicine</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Pediatrics</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Surgery</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Research</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Free Events</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">CME Credits</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Search;
