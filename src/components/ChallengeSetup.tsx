import { useState } from 'react';
import { CalendarDays, Check, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { isValidE164Phone, sanitizeText } from '../utils/security';

export function ChallengeSetup() {
  const { user, updateChallengeProfile } = useAuth();
  const [startDate, setStartDate] = useState(user?.startDate ?? '');
  const [endDate, setEndDate] = useState(user?.endDate ?? '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const days = startDate && endDate ? Math.round((new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) / 86400000) + 1 : 0;
    if (!startDate || !endDate || days !== 30) {
      setError('Choose dates covering exactly 30 days.');
      return;
    }
    const cleanPhone = sanitizeText(whatsappNumber, 16);
    if (!isValidE164Phone(cleanPhone)) {
      setError('Enter a valid WhatsApp number in E.164 format, for example +94771234567.');
      return;
    }
    updateChallengeProfile({ startDate, endDate, whatsappNumber: cleanPhone });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-panel gradient-border w-full max-w-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="status-ring w-16 h-16 mx-auto mb-5 flex items-center justify-center"><Shield className="w-8 h-8 text-fire-orange" /></div>
          <p className="text-xs tracking-[0.3em] text-fire-orange uppercase font-body">Mission configuration</p>
          <h1 className="font-display text-2xl sm:text-3xl font-black mt-3 text-white">Prepare your ascension</h1>
          <p className="text-sm text-white/50 font-body mt-2">Welcome, {user?.fullName}. Set your campaign window and daily dispatch number.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="auth-label"><span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-radiant-gold" /> Start date</span><input className="auth-input" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></label>
            <label className="auth-label"><span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-radiant-gold" /> End date</span><input className="auth-input" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></label>
          </div>
          <label className="auth-label"><span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp number</span><input className="auth-input" type="tel" placeholder="+94771234567" value={whatsappNumber} onChange={(event) => setWhatsappNumber(event.target.value)} required /></label>
          {error && <p className="text-sm text-red-300 font-body" role="alert">{error}</p>}
          <button className="auth-submit" type="submit">Save mission settings <Check className="w-4 h-4" /></button>
        </form>
      </div>
    </main>
  );
}