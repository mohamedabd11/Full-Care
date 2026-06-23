/**
 * محرّك التحفيز — منطق نقي قابل للاختبار (بلا تخزين ولا React).
 * يحسب النقاط والمستوى وسلاسل الأيام والشارات من سجلّ المهام المكتملة.
 *
 * مصدر الحقيقة الوحيد هو سجلّ المهام حسب التاريخ (completedByDate)؛
 * النقاط والإحصاءات تُشتق منه لتفادي أي انزلاق في الأرقام.
 */

/** سجلّ المهام المكتملة: لكل يوم (YYYY-MM-DD) قائمة معرّفات المهام */
export type CompletedByDate = Record<string, string[]>;

export const POINTS_PER_TASK = 10;

// ===== أدوات تاريخ داخلية (بلا تبعيات خارجية ليبقى المحرك قابلاً للتشغيل في node) =====

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function keyToDayNumber(key: string): number {
  const [y, m, d] = key.split('-').map((n) => parseInt(n, 10));
  return Math.round(new Date(y, m - 1, d).getTime() / 86_400_000);
}

function isActive(log: CompletedByDate, key: string): boolean {
  return (log[key]?.length ?? 0) > 0;
}

// ===== النقاط والإحصاءات =====

export function computeTotalTasks(log: CompletedByDate): number {
  return Object.values(log).reduce((sum, ids) => sum + ids.length, 0);
}

export function computePoints(log: CompletedByDate): number {
  return computeTotalTasks(log) * POINTS_PER_TASK;
}

/**
 * السلسلة الحالية: عدد الأيام المتتالية النشطة المنتهية باليوم أو الأمس (فترة سماح).
 * لو اليوم نشط نعدّه ومن قبله؛ وإلا نسمح بالبدء من الأمس حتى لا تنكسر السلسلة فوراً.
 */
export function computeCurrentStreak(log: CompletedByDate, today: Date = new Date()): number {
  let cursorNum = keyToDayNumber(dayKey(today));

  const activeAt = (num: number) => {
    const d = new Date(num * 86_400_000);
    return isActive(log, dayKey(d));
  };

  if (!activeAt(cursorNum)) {
    cursorNum -= 1; // فترة سماح ليوم واحد
    if (!activeAt(cursorNum)) return 0;
  }

  let count = 0;
  while (activeAt(cursorNum)) {
    count++;
    cursorNum -= 1;
  }
  return count;
}

/** أطول سلسلة أيام متتالية نشطة في كامل السجلّ */
export function computeLongestStreak(log: CompletedByDate): number {
  const nums = Object.keys(log)
    .filter((k) => isActive(log, k))
    .map(keyToDayNumber)
    .sort((a, b) => a - b);

  if (nums.length === 0) return 0;

  let longest = 1;
  let run = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1] + 1) {
      run++;
    } else if (nums[i] !== nums[i - 1]) {
      run = 1;
    }
    if (run > longest) longest = run;
  }
  return longest;
}

// ===== المستويات =====

const LEVEL_TITLES = [
  'مبتدئة',
  'مهتمّة',
  'مواظِبة',
  'متألّقة',
  'خبيرة',
  'ملكة الجمال',
];

/** النقاط التراكمية المطلوبة للوصول إلى المستوى L (L >= 1) */
export function levelThreshold(level: number): number {
  if (level <= 1) return 0;
  return 50 * level * (level - 1);
}

export interface LevelInfo {
  level: number;
  title: string;
  pointsIntoLevel: number; // النقاط داخل المستوى الحالي
  pointsForLevel: number; // إجمالي نقاط هذا المستوى
  pointsToNext: number; // المتبقي للمستوى التالي
  progressPercent: number; // 0-100 داخل المستوى الحالي
}

export function levelForPoints(points: number): LevelInfo {
  const p = Math.max(0, Math.floor(points));
  let level = 1;
  while (levelThreshold(level + 1) <= p) level++;

  const start = levelThreshold(level);
  const next = levelThreshold(level + 1);
  const span = next - start;

  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    pointsIntoLevel: p - start,
    pointsForLevel: span,
    pointsToNext: next - p,
    progressPercent: span > 0 ? Math.round(((p - start) / span) * 100) : 0,
  };
}

// ===== الشارات =====

export interface GamiStats {
  totalPoints: number;
  totalTasks: number;
  currentStreak: number;
  longestStreak: number;
  habsaCompleted: boolean;
}

export interface BadgeDef {
  id: string;
  nameAr: string;
  descAr: string;
  emoji: string;
  /** شرط الاستحقاق */
  earned: (s: GamiStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first_step',
    nameAr: 'أول خطوة',
    descAr: 'أكملتِ أول مهمة في رحلتكِ',
    emoji: '🌱',
    earned: (s) => s.totalTasks >= 1,
  },
  {
    id: 'streak_3',
    nameAr: 'ثلاثة أيام',
    descAr: 'مواظبة ٣ أيام متتالية',
    emoji: '🔥',
    earned: (s) => s.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    nameAr: 'أسبوع كامل',
    descAr: 'مواظبة ٧ أيام متتالية',
    emoji: '⭐',
    earned: (s) => s.longestStreak >= 7,
  },
  {
    id: 'points_100',
    nameAr: 'مئة نقطة',
    descAr: 'جمعتِ ١٠٠ نقطة',
    emoji: '💯',
    earned: (s) => s.totalPoints >= 100,
  },
  {
    id: 'dedicated_50',
    nameAr: 'مثابِرة',
    descAr: 'أكملتِ ٥٠ مهمة',
    emoji: '💪',
    earned: (s) => s.totalTasks >= 50,
  },
  {
    id: 'points_500',
    nameAr: 'متوّجة',
    descAr: 'جمعتِ ٥٠٠ نقطة',
    emoji: '👑',
    earned: (s) => s.totalPoints >= 500,
  },
  {
    id: 'habsa_finisher',
    nameAr: 'عروس مكتملة',
    descAr: 'أتممتِ رحلة الحَبْسَة',
    emoji: '👰',
    earned: (s) => s.habsaCompleted,
  },
];

/** معرّفات الشارات المستحَقّة وفق الإحصاءات الحالية */
export function evaluateBadges(stats: GamiStats): string[] {
  return BADGES.filter((b) => b.earned(stats)).map((b) => b.id);
}

/** يبني كائن الإحصاءات من السجلّ (نقطة تجميع واحدة) */
export function buildStats(
  log: CompletedByDate,
  habsaCompleted: boolean,
  today: Date = new Date()
): GamiStats {
  return {
    totalPoints: computePoints(log),
    totalTasks: computeTotalTasks(log),
    currentStreak: computeCurrentStreak(log, today),
    longestStreak: computeLongestStreak(log),
    habsaCompleted,
  };
}
