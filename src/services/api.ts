
import { supabase } from "@/integrations/supabase/client";

// Posts API
export const postsAPI = {
  getPosts: async () => {
    console.log('Fetching posts...');
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          specialization,
          verified
        ),
        post_likes!left (user_id),
        post_comments!left (id)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    // Transform the data to include like counts and user's like status
    const transformedData = data?.map(post => ({
      ...post,
      like_count: post.post_likes?.length || 0,
      comment_count: post.post_comments?.length || 0,
      is_liked: false // Will be set by the component based on current user
    })) || [];
    
    console.log('Posts fetched successfully:', transformedData);
    return transformedData;
  },

  createPost: async (postData: { title: string; content?: string; image_url?: string }) => {
    console.log('Creating post:', postData);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        user_id: user.id,
      })
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          specialization,
          verified
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    console.log('Post created successfully:', data);
    return data;
  },

  toggleLike: async (postId: string) => {
    console.log('Toggling like for post:', postId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check if like exists
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing like:', error);
        throw error;
      }
      console.log('Like removed successfully');
      return { liked: false };
    } else {
      // Add like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (error) {
        console.error('Error adding like:', error);
        throw error;
      }
      console.log('Like added successfully');
      return { liked: true };
    }
  },
};

// Profile API
export const profileAPI = {
  updateProfile: async (profileData: any) => {
    console.log('Updating profile:', profileData);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    console.log('Profile updated successfully:', data);
    return data;
  },

  getProfile: async (userId: string) => {
    console.log('Fetching profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    console.log('Profile fetched:', data);
    return data;
  },
};

// Jobs API
export const jobsAPI = {
  getJobs: async (filters?: any) => {
    console.log('Fetching jobs with filters:', filters);
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles:posted_by (
          id,
          first_name,
          last_name,
          specialization
        ),
        job_applications!left (id)
      `)
      .order('created_at', { ascending: false });

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.specialization) {
      query = query.ilike('title', `%${filters.specialization}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    
    const transformedData = data?.map(job => ({
      ...job,
      application_count: job.job_applications?.length || 0
    })) || [];
    
    console.log('Jobs fetched successfully:', transformedData);
    return transformedData;
  },

  applyForJob: async (jobId: string, coverLetter?: string) => {
    console.log('Applying for job:', jobId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        user_id: user.id,
        cover_letter: coverLetter,
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
    console.log('Job application submitted successfully:', data);
    return data;
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    console.log('Fetching conversations...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants!inner (
          user_id,
          profiles (
            id,
            first_name,
            last_name
          )
        ),
        messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    console.log('Conversations fetched successfully:', data);
    return data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    console.log('Sending message to conversation:', conversationId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    console.log('Message sent successfully:', data);
    return data;
  },
};

// Connections API
export const connectionsAPI = {
  getConnections: async () => {
    console.log('Fetching connections...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        requester:requester_id (
          id,
          first_name,
          last_name,
          specialization
        ),
        addressee:addressee_id (
          id,
          first_name,
          last_name,
          specialization
        )
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
    console.log('Connections fetched successfully:', data);
    return data;
  },

  sendConnectionRequest: async (addresseeId: string) => {
    console.log('Sending connection request to:', addresseeId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: user.id,
        addressee_id: addresseeId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
    console.log('Connection request sent successfully:', data);
    return data;
  },
};

// Search API
export const searchAPI = {
  searchUsers: async (query: string) => {
    console.log('Searching users with query:', query);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialization.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }
    console.log('Users search results:', data);
    return data;
  },

  searchPosts: async (query: string) => {
    console.log('Searching posts with query:', query);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          first_name,
          last_name,
          specialization
        )
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
    console.log('Posts search results:', data);
    return data;
  },
};

// Events API
export const eventsAPI = {
  getEvents: async () => {
    console.log('Fetching events...');
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles:created_by (
          id,
          first_name,
          last_name
        ),
        event_registrations!left (id)
      `)
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    const transformedData = data?.map(event => ({
      ...event,
      registration_count: event.event_registrations?.length || 0
    })) || [];
    
    console.log('Events fetched successfully:', transformedData);
    return transformedData;
  },

  registerForEvent: async (eventId: string) => {
    console.log('Registering for event:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
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
  getCaseStudies: async () => {
    console.log('Fetching case studies...');
    const { data, error } = await supabase
      .from('case_studies')
      .select(`
        *,
        profiles:author_id (
          id,
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
    console.log('Case studies fetched successfully:', data);
    return data;
  },

  createCaseStudy: async (caseStudyData: { title: string; description?: string; content?: string }) => {
    console.log('Creating case study:', caseStudyData);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('case_studies')
      .insert({
        ...caseStudyData,
        author_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating case study:', error);
      throw error;
    }
    console.log('Case study created successfully:', data);
    return data;
  },
};
