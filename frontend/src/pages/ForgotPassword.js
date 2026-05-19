import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setMessage('If an account exists with that email, a password reset link has been sent.');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="forgot-password-heading">
            Forgot Password?
          </h2>
          <p className="text-sm text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="forgot-password-form">
          {error && (
            <div className="bg-[#FF3B30]/20 border border-[#FF3B30]/30 text-[#FF3B30] px-4 py-3 rounded-md text-sm" data-testid="error-message">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-[#34C759]/20 border border-[#34C759]/30 text-[#34C759] px-4 py-3 rounded-md text-sm" data-testid="success-message">
              {message}
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
              placeholder="you@example.com"
              data-testid="email-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007AFF] text-white border border-[#007AFF] hover:bg-[#005BB5] hover:border-[#005BB5] transition-all duration-200 active:scale-95"
            data-testid="submit-button"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-sm text-[#007AFF] hover:text-[#005BB5] transition-colors duration-200"
            data-testid="back-to-login-link"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
