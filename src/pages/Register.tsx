
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, Sparkles, Key } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Extract username from email and use as password
  const extractUsername = (email: string) => {
    if (email.includes('@')) {
      return email.split('@')[0];
    }
    return email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@gmail.com')) {
      toast.error('Please use a valid Gmail address');
      return;
    }

    const username = extractUsername(email);
    
    if (username.length < 3) {
      toast.error('Email username must be at least 3 characters long');
      return;
    }
    
    setIsLoading(true);

    try {
      const success = await register(name.trim(), username, username, 'trainer');
      
      if (success) {
        toast.success(`Account created! Your password is: ${username}`);
        toast.info('Save your password for future logins');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentUsername = extractUsername(email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muscle-red/5 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-muscle-red to-red-600 p-3 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Join as a Trainer</h1>
          <p className="text-gray-600">Create your trainer account to get started</p>
        </div>
        
        {/* Registration Card */}
        <Card className="mobile-card shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">Trainer Registration</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in your details to create your trainer account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mobile-input pl-10 h-12 text-base"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mobile-input pl-10 h-12 text-base"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Must be a Gmail address. Your password will be auto-generated.
                </p>
              </div>

              {/* Auto-generated Password Preview */}
              {email && currentUsername && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Your Auto-generated Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value={currentUsername}
                      readOnly
                      className="mobile-input pl-10 h-12 text-base bg-green-50 border-green-200"
                    />
                  </div>
                  <p className="text-xs text-green-600">
                    Save this password! You'll need it to log in.
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">How it works:</h4>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• Your password is the part before @ in your email</li>
                  <li>• Example: john@gmail.com → password: john</li>
                  <li>• Simple and secure for quick access</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full mobile-cta bg-gradient-to-r from-muscle-red to-red-600 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading || !email.includes('@gmail.com')}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Trainer Account'
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-muscle-red hover:text-red-700 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
