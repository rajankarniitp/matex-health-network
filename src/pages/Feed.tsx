
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
  Bookmark,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts, useCreatePost, useToggleLike } from '@/hooks/useApi';

const Feed = () => {
  const [newPost, setNewPost] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const { user, profile, loading: authLoading } = useAuth();
  
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts();
  const createPostMutation = useCreatePost();
  const toggleLikeMutation = useToggleLike();

  console.log('Feed: Auth state:', { user: !!user, profile: !!profile, authLoading });
  console.log('Feed: Posts state:', { posts: posts?.length, postsLoading, postsError });

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      return;
    }

    createPostMutation.mutate({
      title: newPost.split('\n')[0] || 'Untitled Post',
      content: newPost,
    }, {
      onSuccess: () => {
        setNewPost('');
      }
    });
  };

  const handleLike = (postId: string) => {
    toggleLikeMutation.mutate(postId);
  };

  const handleSave = (postId: string) => {
    console.log('Save post:', postId);
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4" />;
      case 'mates': return <Users className="h-4 w-4" />;
      case 'private': return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500 dark:text-gray-400">Please log in to view the feed.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (postsError) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading posts</p>
            <p className="text-gray-500 text-sm">{postsError.message}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Create Post */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Share with your network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Your profile" />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.specialization || 'Healthcare Professional'}</p>
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
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || createPostMutation.isPending}
                  className="sm:ml-2 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createPostMutation.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {postsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={`${post.profiles?.first_name} ${post.profiles?.last_name}`} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        {post.profiles?.first_name?.[0]}{post.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {post.profiles?.first_name} {post.profiles?.last_name}
                            </h3>
                            {post.profiles?.verified && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{post.profiles?.specialization}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                            <span className="text-gray-400 dark:text-gray-500">{getPrivacyIcon('public')}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                        
                        {post.image_url && (
                          <div className="mt-4">
                            <img 
                              src={post.image_url} 
                              alt="Post attachment" 
                              className="rounded-lg max-w-full h-auto border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            disabled={toggleLikeMutation.isPending}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Like ({post.post_likes?.[0]?.count || 0})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Comment ({post.post_comments?.[0]?.count || 0})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSave(post.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
            </div>
          )}
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
