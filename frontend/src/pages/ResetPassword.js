import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, newPassword);
    setLoading(false);
    if (result.success) {
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="reset-password-heading">
            Reset Password
          </h2>
          <p className="text-sm text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="reset-password-form">
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
            <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="bg-[#121212] border-white/20 focus:ring-[#007AFF] focus:border-transparent text-white placeholder-zinc-500"
              placeholder="Minimum 6 characters"
              data-testid="new-password-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="bg-[#121212] border-white/20 focus:ring-[#007AFF] focus:border-transparent text-white placeholder-zinc-500"
              placeholder="Re-enter your password"
              data-testid="confirm-password-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007AFF] text-white border border-[#007AFF] hover:bg-[#005BB5] hover:border-[#005BB5] transition-all duration-200 active:scale-95"
            data-testid="submit-button"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
