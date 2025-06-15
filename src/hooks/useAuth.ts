
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  return useAuthContext();
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log('Login mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: any) => {
      console.error('Login mutation error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      console.log('Signup mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Signup mutation error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      console.log('Logout mutation successful');
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: any) => {
      console.error('Logout mutation error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    },
  });
};
