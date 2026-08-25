import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, KeyRound, Shield, UserPlus } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function AuthScreen() {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    try {
      if (mode === 'signup') await signUp(fullName, email, password);
      else await signIn(email, password);
    } catch (submissionError) {
      setMessage(submissionError instanceof Error ? submissionError.message : 'Unable to continue.');
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-panel gradient-border w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="status-ring w-16 h-16 mx-auto mb-5 flex items-center justify-center">
            <Shield className="w-8 h-8 text-fire-orange" />
          </div>
          <p className="text-xs tracking-[0.3em] text-fire-orange uppercase font-body">Secure access terminal</p>
          <h1 className="font-display text-2xl sm:text-3xl font-black mt-3 text-white">OPERATION PHOENIX</h1>
          <p className="text-sm text-white/50 font-body mt-2">Your 30-day ascension begins here.</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button type="button" onClick={() => setMode('signin')} className={`auth-tab ${mode === 'signin' ? 'auth-tab-active' : ''}`}>
            <KeyRound className="w-4 h-4" /> Sign in
          </button>
          <button type="button" onClick={() => setMode('signup')} className={`auth-tab ${mode === 'signup' ? 'auth-tab-active' : ''}`}>
            <UserPlus className="w-4 h-4" /> Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <label className="auth-label">Full name<input className="auth-input" value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" /></label>
          )}
          <label className="auth-label">Email<input className="auth-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label className="auth-label">
            Password
            <span className="relative block mt-2">
              <input
                className="auth-input pr-12 mt-0"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 sound-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </span>
          </label>
          {mode === 'signup' && <p className="text-xs text-white/40 font-body">Use 8+ characters with uppercase, lowercase, and a symbol.</p>}
          {message && <p className="text-sm text-red-300 font-body" role="alert">{message}</p>}
          <button className="auth-submit" disabled={loading} type="submit">
            {loading ? 'Authenticating...' : mode === 'signup' ? 'Create secure account' : 'Enter dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
