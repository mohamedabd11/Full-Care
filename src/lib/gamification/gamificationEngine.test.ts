/**
 * اختبارات محرّك التحفيز — تشغيل: node src/lib/gamification/gamificationEngine.test.ts
 */
import {
  computePoints,
  computeTotalTasks,
  computeCurrentStreak,
  computeLongestStreak,
  levelThreshold,
  levelForPoints,
  evaluateBadges,
  buildStats,
  POINTS_PER_TASK,
  type CompletedByDate,
} from './gamificationEngine.ts';

let passed = 0;
let failed = 0;
function eq<T>(name: string, actual: T, expected: T) {
  const ok = actual === expected;
  ok ? passed++ : failed++;
  console.log(`  ${ok ? '✓' : '✗ FAIL:'} ${name} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`);
}
function ok(name: string, cond: boolean) {
  cond ? passed++ : failed++;
  console.log(`  ${cond ? '✓' : '✗ FAIL:'} ${name}`);
}

console.log('— النقاط —');
{
  const log: CompletedByDate = { '2026-06-20': ['a', 'b'], '2026-06-21': ['c'] };
  eq('إجمالي المهام', computeTotalTasks(log), 3);
  eq('النقاط = مهام × 10', computePoints(log), 30);
  eq('POINTS_PER_TASK', POINTS_PER_TASK, 10);
  eq('سجل فارغ = 0 نقطة', computePoints({}), 0);
  // أيام بقوائم فارغة لا تُحتسب
  eq('يوم فارغ لا يُحتسب', computeTotalTasks({ '2026-06-20': [] }), 0);
}

console.log('— المستويات —');
{
  eq('عتبة م1', levelThreshold(1), 0);
  eq('عتبة م2', levelThreshold(2), 100);
  eq('عتبة م3', levelThreshold(3), 300);
  eq('عتبة م4', levelThreshold(4), 600);

  eq('0 نقطة → م1', levelForPoints(0).level, 1);
  eq('99 نقطة → م1', levelForPoints(99).level, 1);
  eq('100 نقطة → م2', levelForPoints(100).level, 2);
  eq('299 نقطة → م2', levelForPoints(299).level, 2);
  eq('300 نقطة → م3', levelForPoints(300).level, 3);

  const l = levelForPoints(150); // م2: داخل المستوى 50 من 200
  eq('م2 نقاط داخل المستوى', l.pointsIntoLevel, 50);
  eq('م2 إجمالي نقاط المستوى', l.pointsForLevel, 200);
  eq('م2 المتبقي للتالي', l.pointsToNext, 150);
  eq('م2 نسبة التقدم', l.progressPercent, 25);
  ok('للمستوى عنوان', l.title.length > 0);
}

console.log('— السلسلة الحالية (مع فترة سماح) —');
{
  const today = new Date(2026, 5, 23); // 23 يونيو
  const log: CompletedByDate = {
    '2026-06-21': ['x'],
    '2026-06-22': ['x'],
    '2026-06-23': ['x'],
  };
  eq('٣ أيام متتالية حتى اليوم', computeCurrentStreak(log, today), 3);
}
{
  const today = new Date(2026, 5, 23);
  // اليوم غير نشط لكن الأمس نشط → فترة سماح، السلسلة مستمرة
  const log: CompletedByDate = { '2026-06-21': ['x'], '2026-06-22': ['x'] };
  eq('فترة سماح: تستمر حتى الأمس', computeCurrentStreak(log, today), 2);
}
{
  const today = new Date(2026, 5, 23);
  // فجوة: آخر نشاط قبل يومين → منكسرة
  const log: CompletedByDate = { '2026-06-20': ['x'] };
  eq('فجوة يومين → 0', computeCurrentStreak(log, today), 0);
}
{
  eq('سجل فارغ → 0', computeCurrentStreak({}, new Date(2026, 5, 23)), 0);
}

console.log('— أطول سلسلة —');
{
  const log: CompletedByDate = {
    '2026-06-01': ['x'],
    '2026-06-02': ['x'],
    '2026-06-03': ['x'],
    // فجوة
    '2026-06-10': ['x'],
    '2026-06-11': ['x'],
  };
  eq('أطول سلسلة = 3', computeLongestStreak(log), 3);
  eq('سجل فارغ → 0', computeLongestStreak({}), 0);
  eq('يوم واحد → 1', computeLongestStreak({ '2026-06-01': ['x'] }), 1);
}

console.log('— الشارات —');
{
  const noneBadges = evaluateBadges({
    totalPoints: 0, totalTasks: 0, currentStreak: 0, longestStreak: 0, habsaCompleted: false,
  });
  eq('لا شارات في البداية', noneBadges.length, 0);

  const first = evaluateBadges({
    totalPoints: 10, totalTasks: 1, currentStreak: 1, longestStreak: 1, habsaCompleted: false,
  });
  ok('أول خطوة تُمنح بعد أول مهمة', first.includes('first_step'));

  const many = evaluateBadges({
    totalPoints: 600, totalTasks: 60, currentStreak: 7, longestStreak: 8, habsaCompleted: true,
  });
  ok('شارة أسبوع', many.includes('streak_7'));
  ok('شارة 100 نقطة', many.includes('points_100'));
  ok('شارة 500 نقطة', many.includes('points_500'));
  ok('شارة 50 مهمة', many.includes('dedicated_50'));
  ok('شارة إتمام الحبسة', many.includes('habsa_finisher'));
}

console.log('— buildStats تجميع شامل —');
{
  const today = new Date(2026, 5, 23);
  const log: CompletedByDate = { '2026-06-22': ['a'], '2026-06-23': ['b', 'c'] };
  const s = buildStats(log, false, today);
  eq('نقاط', s.totalPoints, 30);
  eq('مهام', s.totalTasks, 3);
  eq('سلسلة حالية', s.currentStreak, 2);
  eq('habsaCompleted', s.habsaCompleted, false);
}

console.log(`\nالنتيجة: ${passed} ناجح، ${failed} فاشل`);
if (failed > 0) process.exit(1);
