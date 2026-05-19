import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1759661881353-5b9cc55e1cf4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwyfHxjeWJlciUyMHNlY3VyaXR5JTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3NjI1NDI4N3ww&ixlib=rb-4.1.0&q=85)' }}
        >
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center px-8 lg:px-16">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            AI Crime Prediction System
          </h1>
          <p className="text-lg text-[#A1A1AA] tracking-wide" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Advanced analytics for safer communities
          </p>
        </div>
      </div>
      
      <div className="w-full lg:w-[500px] bg-[#050505] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="login-heading">
              Sign In
            </h2>
            <p className="text-sm text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            {error && (
              <div className="bg-[#FF3B30]/20 border border-[#FF3B30]/30 text-[#FF3B30] px-4 py-3 rounded-md text-sm" data-testid="login-error">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#121212] border-white/20 focus:ring-[#007AFF] focus:border-transparent text-white placeholder-zinc-500"
                placeholder="admin@crime.com"
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#121212] border-white/20 focus:ring-[#007AFF] focus:border-transparent text-white placeholder-zinc-500"
                placeholder="Enter your password"
                data-testid="login-password-input"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#007AFF] hover:text-[#005BB5] transition-colors duration-200"
                data-testid="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007AFF] text-white border border-[#007AFF] hover:bg-[#005BB5] hover:border-[#005BB5] transition-all duration-200 active:scale-95"
              data-testid="login-submit-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-[#71717A]">Don't have an account? </span>
            <Link 
              to="/register" 
              className="text-sm text-[#007AFF] hover:text-[#005BB5] transition-colors duration-200 font-semibold"
              data-testid="register-link"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
