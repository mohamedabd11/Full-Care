/**
 * سياق التحفيز المشترك: مصدر واحد للنقاط والمستوى والشارات وسجلّ المهام
 * تستهلكه كل الشاشات (الرئيسية، الحَبْسَة، حسابي) فتبقى متزامنة.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  buildStats,
  evaluateBadges,
  levelForPoints,
  BADGES,
  type CompletedByDate,
  type GamiStats,
  type LevelInfo,
  type BadgeDef,
} from './gamificationEngine';
import {
  loadCompletedLog,
  saveCompletedLog,
  loadUnlockedBadges,
  saveUnlockedBadges,
  loadHabsaCompletedFlag,
  saveHabsaCompletedFlag,
} from './gamificationStorage';
import { toISODate } from '@/lib/habsa/dateUtils';

interface GamificationValue {
  loading: boolean;
  stats: GamiStats;
  level: LevelInfo;
  badges: { def: BadgeDef; unlocked: boolean }[];
  isTaskDone: (taskId: string, date?: Date) => boolean;
  toggleTask: (taskId: string, date?: Date) => void;
  reportHabsaCompleted: () => void;
  reset: () => void;
}

const GamificationContext = createContext<GamificationValue | null>(null);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState<CompletedByDate>({});
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [habsaDone, setHabsaDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [l, b, h] = await Promise.all([
        loadCompletedLog(),
        loadUnlockedBadges(),
        loadHabsaCompletedFlag(),
      ]);
      if (!mounted) return;
      setLog(l);
      setUnlocked(b);
      setHabsaDone(h);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => buildStats(log, habsaDone), [log, habsaDone]);
  const level = useMemo(() => levelForPoints(stats.totalPoints), [stats.totalPoints]);

  // يدمج الشارات المستحقّة حديثاً في القائمة المحفوظة (لا تُسحب أبداً)
  const syncBadges = useCallback(
    (s: GamiStats, currentUnlocked: string[]) => {
      const earned = evaluateBadges(s);
      const merged = Array.from(new Set([...currentUnlocked, ...earned]));
      if (merged.length !== currentUnlocked.length) {
        setUnlocked(merged);
        void saveUnlockedBadges(merged);
      }
    },
    []
  );

  // كلما تغيّرت الإحصاءات راجع الشارات
  useEffect(() => {
    if (!loading) syncBadges(stats, unlocked);
  }, [stats, loading, syncBadges, unlocked]);

  const isTaskDone = useCallback(
    (taskId: string, date: Date = new Date()) => {
      const key = toISODate(date);
      return (log[key] ?? []).includes(taskId);
    },
    [log]
  );

  const toggleTask = useCallback(
    (taskId: string, date: Date = new Date()) => {
      const key = toISODate(date);
      setLog((prev) => {
        const set = new Set(prev[key] ?? []);
        if (set.has(taskId)) set.delete(taskId);
        else set.add(taskId);
        const next = { ...prev };
        if (set.size === 0) delete next[key];
        else next[key] = Array.from(set);
        void saveCompletedLog(next);
        return next;
      });
    },
    []
  );

  const reportHabsaCompleted = useCallback(() => {
    setHabsaDone((prev) => {
      if (prev) return prev;
      void saveHabsaCompletedFlag(true);
      return true;
    });
  }, []);

  const reset = useCallback(() => {
    setLog({});
    setUnlocked([]);
    setHabsaDone(false);
    void saveCompletedLog({});
    void saveUnlockedBadges([]);
    void saveHabsaCompletedFlag(false);
  }, []);

  const badges = useMemo(
    () => BADGES.map((def) => ({ def, unlocked: unlocked.includes(def.id) })),
    [unlocked]
  );

  const value: GamificationValue = {
    loading,
    stats,
    level,
    badges,
    isTaskDone,
    toggleTask,
    reportHabsaCompleted,
    reset,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification(): GamificationValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error('useGamification يجب استخدامه داخل GamificationProvider');
  }
  return ctx;
}
