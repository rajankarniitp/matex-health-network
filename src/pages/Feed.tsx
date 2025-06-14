
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
  Bookmark
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
      content: 'Just completed a groundbreaking minimally invasive cardiac procedure. The patient recovery time has been reduced by 40% compared to traditional methods. This new technique could revolutionize cardiac surgery.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
      likes: 24,
      comments: 8,
      shares: 5,
      verified: true,
      privacy: 'public',
      reactions: { like: 15, heart: 9 }
    },
    {
      id: 2,
      author: 'Dr. Michael Chen',
      role: 'Neurologist',
      specialization: 'Neurosurgery',
      time: '4 hours ago',
      content: 'Exciting developments at the International Neuroscience Conference! New research on neuroplasticity is opening doors for treating previously untreatable conditions. The future of neuroscience is bright.',
      likes: 18,
      comments: 12,
      shares: 3,
      verified: true,
      privacy: 'public',
      reactions: { like: 12, heart: 6 }
    },
    {
      id: 3,
      author: 'Dr. Priya Patel',
      role: 'Pediatrician',
      specialization: 'Pediatric Surgery',
      time: '1 day ago',
      content: 'Successful pediatric surgery today! 👶 The teamwork between our surgical team, anesthesiologists, and nursing staff was exceptional. Every child deserves the best care possible.',
      likes: 45,
      comments: 15,
      shares: 8,
      verified: true,
      privacy: 'public',
      reactions: { like: 32, heart: 13 }
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
      reactions: { like: 0, heart: 0 }
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
        ? { ...post, likes: post.likes + 1, reactions: { ...post.reactions, like: post.reactions.like + 1 } }
        : post
    ));
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
        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle>Share with your network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your medical insights, achievements, or thoughts with fellow healthcare professionals..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Public</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mates">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Mates</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Only Me</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handlePostSubmit}>
                  Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={post.author} />
                    <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900">{post.author}</h3>
                          {post.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{post.role} • {post.specialization}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-400">{post.time}</span>
                          <span className="text-xs text-gray-400">•</span>
                          {getPrivacyIcon(post.privacy)}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      
                      {post.image && (
                        <div className="mt-4">
                          <img 
                            src={post.image} 
                            alt="Post attachment" 
                            className="rounded-lg max-w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Reactions Summary */}
                    {(post.reactions.like > 0 || post.reactions.heart > 0) && (
                      <div className="flex items-center space-x-4 mt-4 pt-3 border-t">
                        <div className="flex items-center space-x-1">
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
                          <span className="text-sm text-gray-500">
                            {post.reactions.like + post.reactions.heart}
                          </span>
                        </div>
                        
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span>{post.comments} comments</span>
                          <span>{post.shares} shares</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleLike(post.id)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feed;
