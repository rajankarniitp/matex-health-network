
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, Heart, Stethoscope, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store token in localStorage
      localStorage.setItem('docmatex_token', 'demo_token_123');
      localStorage.setItem('docmatex_user', JSON.stringify({
        id: '1',
        name: 'Dr. John Doe',
        email: formData.email,
        role: 'doctor',
        verified: true
      }));

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in to DocMateX.",
      });

      navigate('/feed'); // Redirect to feed instead of dashboard
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Coming Soon!",
      description: `${provider} login will be available soon.`,
    });
  };

  return (
    <div className="min-h-screen medical-gradient flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Medical background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-12 h-12 border-2 border-current rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-8 h-8 border border-current rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-current rounded-full animate-bounce"></div>
        <Heart className="absolute top-32 right-32 w-6 h-6 text-red-400 animate-pulse" />
        <Activity className="absolute bottom-40 right-10 w-8 h-8 text-green-400 animate-pulse" />
      </div>

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced Logo with doctor animation */}
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Link to="/" className="inline-block hover:opacity-80 transition-all duration-500 hover:scale-105">
              <div className="medical-card rounded-2xl p-4 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 relative doctor-pulse">
                {/* Medical cross background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10"></div>
                <img 
                  src="/lovable-uploads/aaa35625-b685-4931-8494-60f87b95865a.png" 
                  alt="DocMateX Logo" 
                  className="h-12 sm:h-16 w-auto relative z-10"
                />
                {/* Cute floating stethoscope */}
                <Stethoscope className="absolute -top-2 -right-2 w-6 h-6 text-primary stethoscope-bounce" />
              </div>
            </Link>
          </div>
          
          {/* Medical cross divider */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-1 bg-primary rounded"></div>
            <div className="mx-2 w-1 h-8 bg-secondary rounded"></div>
            <div className="w-8 h-1 bg-primary rounded"></div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, Doctor
          </h2>
          <p className="mt-2 text-sm text-muted-foreground px-2">
            Your trusted healthcare companion awaits
          </p>
          
          {/* Heartbeat line */}
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent heartbeat"></div>
          </div>
        </div>

        <Card className="medical-card border-border/50 backdrop-blur-sm relative overflow-hidden">
          {/* Medical accent border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-6">
            <CardTitle className="text-xl sm:text-2xl text-center text-foreground flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-red-500 heartbeat" />
              Secure Access
              <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground">
              Protected healthcare portal
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {/* Social Login Options */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 medical-card border-border hover:bg-accent transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 medical-card border-border hover:bg-accent transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handleSocialLogin('LinkedIn')}
              >
                <svg className="w-5 h-5 mr-3" fill="#0A66C2" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 medical-card border-border hover:bg-accent transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handleSocialLogin('Apple')}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.025.044 7.333.14 5.882.372 4.85 1.025 4.85 1.025S3.646 1.677 3.646 3.14c0 .696.177 1.4.177 1.4s-.177.704-.177 1.4c0 1.463 1.204 2.115 1.204 2.115s1.032.653 2.483.885c.692.096 1.063.14 4.684.14s3.992-.044 4.684-.14c1.451-.232 2.483-.885 2.483-.885s1.204-.652 1.204-2.115c0-.696-.177-1.4-.177-1.4s.177-.704.177-1.4c0-1.463-1.204-2.115-1.204-2.115S18.118.372 16.667.14C15.975.044 15.604 0 12.017 0z"/>
                  <path d="M16.896 12.017c0-2.84 2.315-5.142 5.184-5.142.147 0 .29.008.434.022-.41-4.011-3.757-7.164-7.887-7.164-4.35 0-7.887 3.537-7.887 7.887 0 .434.036.86.106 1.274 1.274-.622 2.715-.97 4.241-.97 2.84 0 5.142 2.302 5.142 5.142 0 1.526-.348 2.967-.97 4.241.414.07.84.106 1.274.106 4.35 0 7.887-3.537 7.887-7.887 0-4.13-3.153-7.477-7.164-7.887.014.144.022.287.022.434 0 2.869-2.302 5.184-5.142 5.184-1.526 0-2.967-.348-4.241-.97-.07.414-.106.84-.106 1.274 0 4.35 3.537 7.887 7.887 7.887z"/>
                </svg>
                Continue with Apple
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Medical Portal Access
                  <Heart className="w-4 h-4 text-red-500" />
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Medical Email
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary/70" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm bg-input border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Secure Access
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary/70" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 text-sm bg-input border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-input"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                    Keep me signed in
                  </Label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Recovery assistance
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground py-2 sm:py-3 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02] medical-shadow"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" />
                    Securing access...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Enter Medical Portal
                    <Heart className="w-4 h-4 heartbeat" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New to our medical community?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Join DocMateX
                  <Activity className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
