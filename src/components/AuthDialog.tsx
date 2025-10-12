import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    // Mock Google OAuth - in real implementation, this would redirect to Google
    console.log('Google OAuth initiated');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    toast.success('Successfully logged in!', {
      description: 'Welcome back to Mutopia',
      duration: 3000,
    });
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    // Mock Facebook OAuth - in real implementation, this would redirect to Facebook
    console.log('Facebook OAuth initiated');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    toast.success('Successfully logged in!', {
      description: 'Welcome back to Mutopia',
      duration: 3000,
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock email login
    console.log('Email login attempted');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    toast.success('Successfully logged in!', {
      description: 'Welcome back to Mutopia',
      duration: 3000,
    });
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock email signup
    console.log('Email signup attempted');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onClose();
    toast.success('Account created successfully!', {
      description: 'Welcome to Mutopia! Your pet grooming journey begins now.',
      duration: 3000,
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock forgot password
    console.log('Forgot password email sent');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setShowForgotPassword(false);
    setActiveTab('login');
    toast.success('Password reset email sent!', {
      description: 'Check your inbox for the reset link.',
      duration: 4000,
    });
  };

  const resetDialogState = () => {
    setActiveTab('login');
    setShowForgotPassword(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl text-foreground font-medium">
            {showForgotPassword ? 'Reset Your Password' : 'Welcome to Mutopia'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {showForgotPassword 
              ? 'Enter your email address and we\'ll send you a link to reset your password'
              : 'Your pet deserves the best grooming experience'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Forgot Password View */}
        {showForgotPassword ? (
          <div className="space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Main Auth Tabs */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-accent rounded-2xl">
              <TabsTrigger 
                value="login" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

          <TabsContent value="login" className="space-y-4">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <Button
                onClick={handleFacebookAuth}
                variant="outline"
                className="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-card text-muted-foreground text-sm">or</span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" disabled={isLoading} />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>

              <Button
                onClick={handleFacebookAuth}
                variant="outline"
                className="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Sign up with Facebook
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 bg-card text-muted-foreground text-sm">or</span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-first-name">First Name</Label>
                  <Input
                    id="signup-first-name"
                    type="text"
                    placeholder="First name"
                    className="h-12 rounded-2xl bg-input-background border-border"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-last-name">Last Name</Label>
                  <Input
                    id="signup-last-name"
                    type="text"
                    placeholder="Last name"
                    className="h-12 rounded-2xl bg-input-background border-border"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="h-12 rounded-2xl bg-input-background border-border"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" className="rounded mt-1" required disabled={isLoading} />
                <label className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}