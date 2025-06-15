
import { supabase } from '@/integrations/supabase/client';

// Posts/Feed API
export const postsAPI = {
  // Get all posts for feed
  getPosts: async (limit = 20, offset = 0) => {
    console.log('Fetching posts...');
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          role
        ),
        post_likes (
          id,
          user_id
        ),
        post_comments (
          id,
          content,
          created_at,
          profiles!post_comments_user_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    console.log('Posts fetched:', data);
    return data;
  },

  // Create new post
  createPost: async (postData: { title: string; content: string; type?: string }) => {
    console.log('Creating post:', postData);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    console.log('Post created:', data);
    return data;
  },

  // Like/Unlike post
  toggleLike: async (postId: string) => {
    console.log('Toggling like for post:', postId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (error) throw error;
      console.log('Post unliked');
      return { liked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });
      
      if (error) throw error;
      console.log('Post liked');
      return { liked: true };
    }
  },

  // Add comment to post
  addComment: async (postId: string, content: string) => {
    console.log('Adding comment to post:', postId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
    
    console.log('Comment added:', data);
    return data;
  },
};

// Jobs API
export const jobsAPI = {
  // Get all jobs
  getJobs: async (filters?: { location?: string; type?: string; specialization?: string }) => {
    console.log('Fetching jobs with filters:', filters);
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_posted_by_fkey (
          first_name,
          last_name,
          organization
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.type) {
      query = query.eq('job_type', filters.type);
    }
    if (filters?.specialization) {
      query = query.ilike('specialization', `%${filters.specialization}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    
    console.log('Jobs fetched:', data);
    return data;
  },

  // Apply for job
  applyForJob: async (jobId: string, coverLetter?: string) => {
    console.log('Applying for job:', jobId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        user_id: user.id,
        cover_letter: coverLetter,
        status: 'pending',
        applied_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
    
    console.log('Job application submitted:', data);
    return data;
  },
};

// Messages/Chat API
export const messagesAPI = {
  // Get conversations
  getConversations: async () => {
    console.log('Fetching conversations...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:profiles!conversations_participant1_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        participant2:profiles!conversations_participant2_fkey (
          id,
          first_name,
          last_name,
          avatar_url
        ),
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .or(`participant1.eq.${user.id},participant2.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    
    console.log('Conversations fetched:', data);
    return data;
  },

  // Send message
  sendMessage: async (conversationId: string, content: string) => {
    console.log('Sending message to conversation:', conversationId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    console.log('Message sent:', data);
    return data;
  },
};

// Connections/Mates API
export const connectionsAPI = {
  // Get connections
  getConnections: async () => {
    console.log('Fetching connections...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        requester:profiles!connections_requester_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          role,
          specialization
        ),
        requested:profiles!connections_requested_id_fkey (
          id,
          first_name,
          last_name,
          avatar_url,
          role,
          specialization
        )
      `)
      .or(`requester_id.eq.${user.id},requested_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
    
    console.log('Connections fetched:', data);
    return data;
  },

  // Send connection request
  sendConnectionRequest: async (userId: string) => {
    console.log('Sending connection request to:', userId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: user.id,
        requested_id: userId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
    
    console.log('Connection request sent:', data);
    return data;
  },
};

// Search API
export const searchAPI = {
  // Search users
  searchUsers: async (query: string) => {
    console.log('Searching users:', query);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialization.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }
    
    console.log('Search results:', data);
    return data;
  },

  // Search posts
  searchPosts: async (query: string) => {
    console.log('Searching posts:', query);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
    
    console.log('Search results:', data);
    return data;
  },
};

// Events API
export const eventsAPI = {
  // Get events
  getEvents: async () => {
    console.log('Fetching events...');
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey (
          first_name,
          last_name,
          organization
        )
      `)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    console.log('Events fetched:', data);
    return data;
  },

  // Register for event
  registerForEvent: async (eventId: string) => {
    console.log('Registering for event:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        registered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
    
    console.log('Event registration successful:', data);
    return data;
  },
};

// Case Studies API
export const caseStudiesAPI = {
  // Get case studies
  getCaseStudies: async () => {
    console.log('Fetching case studies...');
    const { data, error } = await supabase
      .from('case_studies')
      .select(`
        *,
        author:profiles!case_studies_author_id_fkey (
          first_name,
          last_name,
          specialization
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching case studies:', error);
      throw error;
    }
    
    console.log('Case studies fetched:', data);
    return data;
  },

  // Create case study
  createCaseStudy: async (caseStudyData: any) => {
    console.log('Creating case study:', caseStudyData);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('case_studies')
      .insert({
        ...caseStudyData,
        author_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating case study:', error);
      throw error;
    }
    
    console.log('Case study created:', data);
    return data;
  },
};
