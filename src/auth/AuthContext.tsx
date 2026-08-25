import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSafeProfileName, isStrongPassword, sanitizeText } from '../utils/security';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  startDate?: string;
  endDate?: string;
  whatsappNumber?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateChallengeProfile: (profile: { startDate: string; endDate: string; whatsappNumber: string }) => void;
}

const AUTH_KEY = 'operation-phoenix-auth-v1';
const USERS_KEY = 'operation-phoenix-users-v1';
const AuthContext = createContext<AuthContextValue | null>(null);

interface StoredUser extends AuthUser {
  passwordHash: string;
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[];
  } catch {
    return [];
  }
}

function persistUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY) ?? 'null') as AuthUser | null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const signUp = async (fullName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    const cleanEmail = sanitizeText(email, 160).toLowerCase();
    const cleanName = getSafeProfileName(fullName);
    if (!cleanEmail.includes('@') || !isStrongPassword(password)) {
      setLoading(false);
      throw new Error('Use a valid email and a strong password with 8+ characters, uppercase, lowercase, and a symbol.');
    }
    const users = loadUsers();
    if (users.some((storedUser) => storedUser.email === cleanEmail)) {
      setLoading(false);
      throw new Error('An account with this email already exists.');
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      fullName: cleanName,
      emailVerified: true,
      passwordHash: await hashPassword(password),
    };
    persistUsers([...users, newUser]);
    setUser({ id: newUser.id, email: newUser.email, fullName: newUser.fullName, emailVerified: true });
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const cleanEmail = sanitizeText(email, 160).toLowerCase();
    const storedUser = loadUsers().find((candidate) => candidate.email === cleanEmail);
    if (!storedUser || storedUser.passwordHash !== await hashPassword(password)) {
      setLoading(false);
      throw new Error('Email or password is incorrect.');
    }
    setUser({ id: storedUser.id, email: storedUser.email, fullName: storedUser.fullName, emailVerified: storedUser.emailVerified });
    setLoading(false);
  };

  const signOut = () => setUser(null);

  const updateChallengeProfile = (profile: { startDate: string; endDate: string; whatsappNumber: string }) => {
    setUser((currentUser) => currentUser ? { ...currentUser, ...profile } : currentUser);
    const users = loadUsers();
    const updatedUsers = users.map((storedUser) => storedUser.id === user?.id ? { ...storedUser, ...profile } : storedUser);
    persistUsers(updatedUsers);
  };

  return <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, updateChallengeProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
