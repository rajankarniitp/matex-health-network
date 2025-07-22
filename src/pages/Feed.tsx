import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Image,
  FileText,
  Video,
  Globe,
  Users,
  Lock,
  MoreHorizontal,
  Heart,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      specialization: 'Interventional Cardiology',
      time: '2 hours ago',
      content: 'Just completed a groundbreaking minimally invasive cardiac procedure using robotic assistance. The patient recovery time has been reduced by 40% compared to traditional methods. This new technique could revolutionize cardiac surgery and improve patient outcomes significantly. \n\nThe precision of robotic tools combined with advanced imaging has allowed us to perform complex procedures through smaller incisions. Looking forward to publishing our findings! 🔬❤️',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      likes: 47,
      comments: 15,
      shares: 8,
      verified: true,
      privacy: 'public',
      reactions: { like: 32, heart: 15 },
      saved: false,
      liked: false
    },
    {
      id: 2,
      author: 'Dr. Michael Chen',
      role: 'Neurologist',
      specialization: 'Neurosurgery',
      time: '4 hours ago',
      content: 'Exciting developments at the International Neuroscience Conference! 🧠✨ New research on neuroplasticity is opening doors for treating previously untreatable conditions. \n\nKey highlights:\n• Brain organoids showing promising results\n• AI-assisted surgical planning\n• Novel treatment for Alzheimer\'s disease\n• Gene therapy breakthroughs\n\nThe future of neuroscience is incredibly bright. Proud to be part of this amazing medical community!',
      likes: 63,
      comments: 22,
      shares: 12,
      verified: true,
      privacy: 'public',
      reactions: { like: 45, heart: 18 },
      saved: false,
      liked: false
    },
    {
      id: 3,
      author: 'Dr. Priya Patel',
      role: 'Pediatrician',
      specialization: 'Pediatric Surgery',
      time: '8 hours ago',
      content: 'Successful pediatric surgery today! 👶💙 Performed a complex congenital heart defect repair on a 6-month-old patient. The teamwork between our surgical team, anesthesiologists, and nursing staff was exceptional.\n\nEvery child deserves the best care possible. Moments like these remind me why I chose pediatric medicine. The little fighter is doing amazingly well post-surgery! 🌟\n\n#PediatricSurgery #Teamwork #Hope',
      likes: 128,
      comments: 34,
      shares: 19,
      verified: true,
      privacy: 'public',
      reactions: { like: 89, heart: 39 },
      saved: false,
      liked: false
    },
    {
      id: 4,
      author: 'Dr. James Wilson',
      role: 'Orthopedic Surgeon',
      specialization: 'Sports Medicine',
      time: '12 hours ago',
      content: 'Amazing case study: Professional athlete returned to competition just 8 weeks after ACL reconstruction using our new enhanced recovery protocol! 🏃‍♂️⚡\n\nOur approach combines:\n✅ Advanced surgical techniques\n✅ Personalized rehabilitation\n✅ Nutritional optimization\n✅ Mental health support\n\nThis holistic approach is changing the game in sports medicine. Recovery times are improving while maintaining excellent long-term outcomes.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      likes: 92,
      comments: 18,
      shares: 14,
      verified: true,
      privacy: 'public',
      reactions: { like: 67, heart: 25 },
      saved: false,
      liked: false
    },
    {
      id: 5,
      author: 'Dr. Emily Rodriguez',
      role: 'Emergency Medicine Physician',
      specialization: 'Trauma Surgery',
      time: '1 day ago',
      content: 'Night shift reflections 🌙 Just finished a 12-hour shift in the ER. We treated everything from minor injuries to life-threatening emergencies. \n\nWhat strikes me most is the resilience of the human spirit. Patients and families facing their worst moments still find ways to show gratitude and hope.\n\nTo my fellow healthcare workers: remember to take care of yourselves too. We can only pour from a full cup. 💪❤️\n\n#EmergencyMedicine #Healthcare #SelfCare #Gratitude',
      likes: 156,
      comments: 41,
      shares: 23,
      verified: true,
      privacy: 'public',
      reactions: { like: 112, heart: 44 },
      saved: false,
      liked: false
    }
  ]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      toast({
        title: "Post content required",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    const newPostObj = {
      id: posts.length + 1,
      author: 'Dr. John Doe',
      role: 'Doctor',
      specialization: 'General Medicine',
      time: 'now',
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      verified: true,
      privacy: privacy,
      reactions: { like: 0, heart: 0 },
      saved: false,
      liked: false
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    
    toast({
      title: "Post shared successfully!",
      description: "Your post has been shared with your network.",
    });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
            reactions: { 
              ...post.reactions, 
              like: post.liked ? post.reactions.like - 1 : post.reactions.like + 1 
            }
          }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved }
        : post
    ));
    
    const post = posts.find(p => p.id === postId);
    toast({
      title: post?.saved ? "Post removed from saved" : "Post saved",
      description: post?.saved ? "The post has been removed from your saved items." : "The post has been saved to your collection.",
    });
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'mates': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Enhanced Create Post */}
        <Card className="feed-card medical-glow bg-gradient-to-br from-blue-50/80 via-white to-green-50/80 dark:from-blue-900/20 dark:via-gray-800 dark:to-green-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full stethoscope-icon"></div>
              Share with your medical network
              <div className="h-2 w-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full heartbeat-icon"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Your profile" />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Dr. John Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">General Medicine</p>
              </div>
            </div>
            
            <Textarea
              placeholder="What's on your mind? Share your medical insights, achievements, or thoughts with fellow healthcare professionals..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Image className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger className="w-32 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="public" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mates" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Mates</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private" className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Only Me</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {/* handlePostSubmit */}}
                  disabled={!newPost.trim()}
                  className="sm:ml-2 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="feed-card hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 dark:from-gray-800 dark:via-blue-900/10 dark:to-green-900/10 border-blue-100 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12 medical-glow">
                    <AvatarImage src="" alt={post.author} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 text-blue-600 dark:text-blue-300 font-semibold">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.author}</h3>
                          {post.verified && (
                            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-700 medical-bounce">
                              ✓ Verified Doctor
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.role} • {post.specialization}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{post.time}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <span className="text-gray-400 dark:text-gray-500">{getPrivacyIcon(post.privacy)}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                      
                      {post.image && (
                        <div className="mt-4">
                          <img 
                            src={post.image} 
                            alt="Post attachment" 
                            className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Reactions Summary */}
                    {(post.reactions.like > 0 || post.reactions.heart > 0) && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {post.reactions.like > 0 && (
                              <div className="bg-blue-500 rounded-full p-1">
                                <ThumbsUp className="h-3 w-3 text-white" />
                              </div>
                            )}
                            {post.reactions.heart > 0 && (
                              <div className="bg-red-500 rounded-full p-1">
                                <Heart className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {post.reactions.like + post.reactions.heart} reactions
                          </span>
                        </div>
                        
                        <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{post.comments} comments</span>
                          <span>{post.shares} shares</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {/* handleLike(post.id) */}}
                          className={`${post.liked ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {/* handleSave(post.id) */}}
                        className={`${post.saved ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {post.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-6">
          <Button variant="outline" className="px-8 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
            Load More Posts
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;
