import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';

export default function VerifyEmail() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const { logEvent, logPageView, logError } = useAnalytics();
  const navigate = useNavigate();

  // Track page view
  React.useEffect(() => {
    logPageView('/verify-email');
  }, [logPageView]);

  // Redirect if no user
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleResendEmail = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setMessage('');
      setLoading(true);

      await sendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
      logEvent('verification_email_sent');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send verification email';
      setError(errorMessage);
      logError('verification_email_failed', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setError('');
      setLoading(true);

      // Reload user to check verification status
      if (currentUser) {
        await currentUser.reload();
      }

      // Check if verified after reload
      if (currentUser?.emailVerified) {
        logEvent('email_verified');
        navigate('/dashboard');
      } else {
        setMessage('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh verification status';
      setError(errorMessage);
      logError('verification_refresh_failed', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAnyway = () => {
    logEvent('continue_without_verification');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-600/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-green-600/40">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
            Verify Your Email
          </h1>
          <p className="text-slate-500 font-medium">
            Check your inbox for the verification link
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-[3rem] p-10">
          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Email Display */}
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Email address</p>
            <p className="text-sm font-semibold text-white">{currentUser?.email}</p>
          </div>

          {/* Instructions */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-bold text-white">Next steps:</h3>
            <ol className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Check your email inbox</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Come back and click "Refresh Status"</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Resend Verification Email
                </>
              )}
            </button>

            <button
              onClick={handleRefreshStatus}
              disabled={loading}
              className="w-full py-4 bg-white/5 hover:bg-white/10 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Refresh Status
                </>
              )}
            </button>

            <button
              onClick={handleContinueAnyway}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Home className="w-5 h-5" />
              Continue to Dashboard
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-12 text-[10px] font-black text-slate-600 uppercase tracking-widest">
          Email verification required • Secure access • SECURE_OS 2026
        </p>
      </div>
    </div>
  );
}
