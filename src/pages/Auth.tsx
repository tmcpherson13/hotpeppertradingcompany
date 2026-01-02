import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import logoDark from '@/assets/logo-dark.svg';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }).max(255),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(128),
  displayName: z.string().trim().max(100).optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/compendium');
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password, displayName: displayName || undefined });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string; displayName?: string } = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          fieldErrors[field as keyof typeof fieldErrors] = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Login Failed',
              description: 'Invalid email or password. Please try again.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Login Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Welcome back',
            description: 'You have successfully logged in.',
          });
          navigate('/compendium');
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: 'Account Exists',
              description: 'An account with this email already exists. Please log in instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Sign Up Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Account Created',
            description: 'Your account has been created. You are now logged in.',
          });
          navigate('/compendium');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          {/* Decorative header */}
          <div className="text-center mb-8">
            <img src={logoDark} alt="" className="h-16 w-auto mx-auto mb-4 opacity-80" />
            <h1 className="font-display text-2xl uppercase tracking-[0.15em] text-ink">
              {isLogin ? 'Registry Access' : 'Join the Registry'}
            </h1>
            <p className="font-body text-sm text-ink/60 mt-2">
              {isLogin 
                ? 'Enter your credentials to access your collection'
                : 'Create an account to contribute to the compendium'
              }
            </p>
          </div>

          {/* Auth form */}
          <div className="bg-parchment-dark/30 border-2 border-ink/20 p-6">
            {/* Corner ornaments */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-ink/30" />
              <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-ink/30" />
              <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-ink/30" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-ink/30" />
            </div>


            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                    Display Name (optional)
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="bg-parchment border-ink/30 focus:border-tyrian"
                  />
                  {errors.displayName && (
                    <p className="text-xs text-red-600">{errors.displayName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@example.com"
                  required
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-heading text-xs uppercase tracking-wider text-ink/70">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-parchment border-ink/30 focus:border-tyrian"
                />
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-tyrian hover:bg-tyrian/90 text-parchment font-heading uppercase tracking-wider"
              >
                {isSubmitting 
                  ? 'Processing...' 
                  : isLogin ? 'Enter the Registry' : 'Create Account'
                }
              </Button>
            </form>

            {/* Toggle login/signup */}
            <div className="mt-6 pt-4 border-t border-ink/15 text-center">
              <p className="font-body text-sm text-ink/60">
                {isLogin ? "Don't have an account?" : 'Already registered?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="font-heading text-sm uppercase tracking-wider text-tyrian hover:text-tyrian/80 mt-1"
              >
                {isLogin ? 'Create Account' : 'Log In'}
              </button>
            </div>
          </div>

          {/* Additional info */}
          <p className="text-center font-body text-xs text-ink/40 mt-6">
            Registered contributors can upload images and save gallery preferences across devices.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}