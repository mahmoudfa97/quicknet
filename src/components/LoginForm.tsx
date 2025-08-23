import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, User, Lock } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
}

export const LoginForm = ({ onToggleMode, isRegisterMode }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let success;
      if (isRegisterMode) {
        success = await register(username, password);
        if (success) {
          toast({
            title: 'Success',
            description: 'Account created successfully! Please login.',
          });
          onToggleMode();
        } else {
          toast({
            title: 'Error',
            description: 'Username already exists',
            variant: 'destructive',
          });
        }
      } else {
        success = await login(username, password);
        if (success) {
          toast({
            title: 'Welcome',
            description: 'Successfully logged in!',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Invalid username or password',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 shadow-elegant animate-slide-in">
        <div className="text-center mb-8">
          <div className="w-32 h-32  flex items-center justify-center mx-auto mb-4">
            <img src="/logo.png" alt="Logo"  />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2"></h1>
          <p className="text-muted-foreground">
            {isRegisterMode ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              {isRegisterMode ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
