import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  displayName: string;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState('ضيفة');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) void fetchDisplayName(s.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        void fetchDisplayName(s.user.id);
      } else {
        setDisplayName('ضيفة');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchDisplayName(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .single();
    if (data?.display_name) setDisplayName(data.display_name);
  }

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) return { error: translateAuthError(error.message) };
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateAuthError(error.message) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateDisplayName = useCallback(async (name: string) => {
    if (!session?.user) return;
    await supabase.from('profiles').update({ display_name: name }).eq('id', session.user.id);
    setDisplayName(name);
  }, [session]);

  const value: AuthValue = {
    loading,
    session,
    user: session?.user ?? null,
    displayName,
    signUp,
    signIn,
    signOut,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  return ctx;
}

function translateAuthError(msg: string): string {
  if (msg.includes('already registered')) return 'هذا البريد مسجّل بالفعل';
  if (msg.includes('Invalid login')) return 'البريد أو كلمة المرور غير صحيحة';
  if (msg.includes('Email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً';
  if (msg.includes('Password should be')) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  if (msg.includes('valid email')) return 'يرجى إدخال بريد إلكتروني صحيح';
  return 'حدث خطأ، حاولي مرة أخرى';
}
