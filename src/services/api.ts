
import { supabase } from '@/integrations/supabase/client';

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return {
      user: data.user,
      session: data.session,
      token: data.session?.access_token
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    
    return {
      user: {
        ...user,
        ...profile,
        name: profile?.first_name && profile?.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : profile?.first_name || 'User'
      }
    };
  },

  updateProfile: async (profileData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getAllProfiles: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Posts API
export const postsAPI = {
  getPosts: async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey(first_name, last_name, specialization),
        post_likes(count),
        post_comments(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  createPost: async (postData: { title: string; content?: string; image_url?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  likePost: async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: user.id
      });

    if (error) throw error;
    return data;
  },

  unlikePost: async (postId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
    return data;
  },

  addComment: async (postId: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getComments: async (postId: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles!post_comments_user_id_fkey(first_name, last_name)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// Connections API
export const connectionsAPI = {
  getConnections: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('connections')
      .select(`
        *,
        requester_profile:profiles!connections_requester_id_fkey(first_name, last_name, specialization),
        addressee_profile:profiles!connections_addressee_id_fkey(first_name, last_name, specialization)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  sendConnectionRequest: async (addresseeId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: user.id,
        addressee_id: addresseeId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateConnectionStatus: async (connectionId: string, status: string) => {
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Jobs API
export const jobsAPI = {
  getJobs: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles!jobs_posted_by_fkey(first_name, last_name, specialization)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  createJob: async (jobData: {
    title: string;
    company: string;
    description?: string;
    location?: string;
    salary_range?: string;
    job_type?: string;
    experience_level?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        posted_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  applyForJob: async (jobId: string, coverLetter?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: jobId,
        user_id: user.id,
        cover_letter: coverLetter
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getUserApplications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs(title, company, location)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// Events API
export const eventsAPI = {
  getEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_created_by_fkey(first_name, last_name),
        event_registrations(count)
      `)
      .order('date_time', { ascending: true });

    if (error) throw error;
    return data;
  },

  createEvent: async (eventData: {
    title: string;
    description?: string;
    date_time: string;
    location?: string;
    max_participants?: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  registerForEvent: async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        conversations(
          id,
          title,
          created_at,
          messages(content, created_at)
        )
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getMessages: async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!messages_sender_id_fkey(first_name, last_name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  createConversation: async (participantIds: string[], title?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        title,
        created_by: user.id
      })
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    const participants = [...participantIds, user.id].map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }));

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) throw participantsError;

    return conversation;
  },
};

// Case Studies API
export const caseStudiesAPI = {
  getCaseStudies: async () => {
    const { data, error } = await supabase
      .from('case_studies')
      .select(`
        *,
        profiles!case_studies_author_id_fkey(first_name, last_name, specialization)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  createCaseStudy: async (caseStudyData: {
    title: string;
    description?: string;
    content?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('case_studies')
      .insert({
        ...caseStudyData,
        author_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export default supabase;
