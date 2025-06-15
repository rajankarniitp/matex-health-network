
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  postsAPI, 
  jobsAPI, 
  messagesAPI, 
  connectionsAPI, 
  searchAPI, 
  eventsAPI, 
  caseStudiesAPI,
  profileAPI
} from '@/services/api';
import { toast } from '@/hooks/use-toast';

// Posts hooks
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: () => postsAPI.getPosts(),
    retry: 3,
    staleTime: 30000, // 30 seconds
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post Created",
        description: "Your post has been published successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Post creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post.",
        variant: "destructive",
      });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsAPI.toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Toggle like error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update like.",
        variant: "destructive",
      });
    },
  });
};

// Profile hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileAPI.getProfile(userId),
    enabled: !!userId,
  });
};

// Jobs hooks
export const useJobs = (filters?: any) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsAPI.getJobs(filters),
    staleTime: 60000, // 1 minute
  });
};

export const useApplyJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, coverLetter }: { jobId: string; coverLetter?: string }) => 
      jobsAPI.applyForJob(jobId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Job application error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application.",
        variant: "destructive",
      });
    },
  });
};

// Messages hooks
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesAPI.getConversations,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      messagesAPI.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      console.error('Send message error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    },
  });
};

// Connections hooks
export const useConnections = () => {
  return useQuery({
    queryKey: ['connections'],
    queryFn: connectionsAPI.getConnections,
  });
};

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: connectionsAPI.sendConnectionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Connection request error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });
};

// Search hooks
export const useSearchUsers = (query: string, enabled = false) => {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: () => searchAPI.searchUsers(query),
    enabled: enabled && query.length > 2,
  });
};

export const useSearchPosts = (query: string, enabled = false) => {
  return useQuery({
    queryKey: ['searchPosts', query],
    queryFn: () => searchAPI.searchPosts(query),
    enabled: enabled && query.length > 2,
  });
};

// Events hooks
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsAPI.getEvents,
  });
};

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventsAPI.registerForEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Registration Successful",
        description: "You have been registered for the event.",
      });
    },
    onError: (error: any) => {
      console.error('Event registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register for event.",
        variant: "destructive",
      });
    },
  });
};

// Case Studies hooks
export const useCaseStudies = () => {
  return useQuery({
    queryKey: ['caseStudies'],
    queryFn: caseStudiesAPI.getCaseStudies,
  });
};

export const useCreateCaseStudy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: caseStudiesAPI.createCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseStudies'] });
      toast({
        title: "Case Study Created",
        description: "Your case study has been published successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Case study creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create case study.",
        variant: "destructive",
      });
    },
  });
};
