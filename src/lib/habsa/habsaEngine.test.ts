/**
 * اختبارات محرّك الحَبْسَة — تشغيل: node src/lib/habsa/habsaEngine.test.ts
 * بدون مكتبة خارجية؛ مدقّق بسيط يطبع PASS/FAIL ويُنهي بكود خطأ عند أي فشل.
 */
import {
  computeFromDuration,
  computeFromWeddingDate,
  calendarDaysBetween,
  FIXED_TOTAL,
  HARD_MINIMUM_DAYS,
  type StageKey,
} from './habsaEngine.ts';

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ FAIL: ${name}`);
  }
}

function eq<T>(name: string, actual: T, expected: T) {
  check(`${name} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`, actual === expected);
}

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

console.log('— calendarDaysBetween —');
eq('نفس اليوم = 0', calendarDaysBetween(d(2026, 1, 1), d(2026, 1, 1)), 0);
eq('يوم واحد', calendarDaysBetween(d(2026, 1, 1), d(2026, 1, 2)), 1);
eq('يتجاهل الوقت (نفس اليوم رغم اختلاف الساعة)',
  calendarDaysBetween(new Date(2026, 0, 1, 23, 59), new Date(2026, 0, 2, 0, 1)), 1);
eq('عبر حدود الشهر', calendarDaysBetween(d(2026, 1, 30), d(2026, 2, 2)), 3);
eq('سالب لو معكوس', calendarDaysBetween(d(2026, 1, 5), d(2026, 1, 1)), -4);

console.log('— computeFromDuration: المدة الدنيا 39 (إصلاح تعارض 30/39) —');
{
  // 35 يوماً: كان ينتج جدولاً مكسوراً صامتاً (isValid=true). الآن غير صالح.
  const s = computeFromDuration(35, d(2026, 1, 1), d(2026, 1, 1));
  eq('35 يوماً غير صالحة', s.isValid, false);
  eq('حالة invalid', s.status, 'invalid');
  check('رسالة تحذير موجودة', !!s.warning);
}
{
  const s = computeFromDuration(38, d(2026, 1, 1), d(2026, 1, 1));
  eq('38 يوماً غير صالحة', s.isValid, false);
}
{
  // 39 بالضبط: صالحة، بدون قلب دخان.
  const s = computeFromDuration(39, d(2026, 1, 1), d(2026, 1, 1));
  eq('39 يوماً صالحة', s.isValid, true);
  eq('عدد المراحل = 4 (بلا قلب دخان)', s.allStages.length, 4);
  eq('المجموع = 39', s.totalDays, 39);
  const keys = s.allStages.map((x) => x.key).join(',');
  eq('ترتيب المراحل بلا قلب دخان', keys, 'preparation,smokeGradual,preWedding,finale');
}

console.log('— توزيع قلب الدخان —');
{
  // 60 يوماً: 39 ثابتة + 21 قلب دخان (مثال صاحب المشروع).
  const s = computeFromDuration(60, d(2026, 1, 1), d(2026, 1, 1));
  eq('60 يوماً صالحة', s.isValid, true);
  eq('5 مراحل', s.allStages.length, 5);
  const core = s.allStages.find((x) => x.key === 'smokeCore')!;
  eq('قلب الدخان = 21 يوماً', core.durationDays, 21);
  // تحقق من سلامة الحدود: لا فجوات ولا تداخل، وآخر يوم = totalDays
  let ok = s.allStages[0].startDay === 1;
  for (let i = 1; i < s.allStages.length; i++) {
    ok = ok && s.allStages[i].startDay === s.allStages[i - 1].endDay + 1;
  }
  ok = ok && s.allStages[s.allStages.length - 1].endDay === 60;
  check('الحدود متّصلة وتنتهي عند 60', ok);
}

console.log('— اليوم الحالي والمرحلة —');
{
  // مدة 60، اليوم = البداية → يوم 1، مرحلة التحضير
  const s = computeFromDuration(60, d(2026, 1, 1), d(2026, 1, 1));
  eq('اليوم الأول = 1', s.currentDay, 1);
  eq('المرحلة الأولى تحضير', s.currentStage?.key as StageKey, 'preparation');
  eq('متبقٍ 59', s.daysRemaining, 59);
}
{
  // اليوم 8 → الدخان المتدرّج (يبدأ يوم 8)
  const s = computeFromDuration(60, d(2026, 1, 1), d(2026, 1, 8));
  eq('اليوم 8', s.currentDay, 8);
  eq('المرحلة دخان متدرّج', s.currentStage?.key as StageKey, 'smokeGradual');
}
{
  // اليوم 15 → قلب الدخان (يبدأ يوم 15)
  const s = computeFromDuration(60, d(2026, 1, 1), d(2026, 1, 15));
  eq('اليوم 15 قلب الدخان', s.currentStage?.key as StageKey, 'smokeCore');
}

console.log('— الحالات: قبل البداية / بعد الانتهاء —');
{
  // اليوم قبل البداية
  const s = computeFromDuration(60, d(2026, 1, 10), d(2026, 1, 1));
  eq('لم تبدأ', s.status, 'not_started');
  eq('اليوم مقيّد إلى 1', s.currentDay, 1);
  eq('صالحة رغم عدم البدء', s.isValid, true);
}
{
  // اليوم بعد النهاية
  const s = computeFromDuration(39, d(2026, 1, 1), d(2026, 3, 1));
  eq('اكتملت', s.status, 'completed');
  eq('اليوم مقيّد إلى المجموع', s.currentDay, 39);
  eq('التقدّم 100%', s.progressPercent, 100);
}

console.log('— computeFromWeddingDate + التحقق من المدخلات —');
{
  // عرس بعد 39 يوماً من البداية → 39 يوماً (يوم العرس غير محتسب)
  const s = computeFromWeddingDate(d(2026, 2, 9), d(2026, 1, 1), d(2026, 1, 1));
  eq('39 يوماً من تاريخ العرس', s.totalDays, 39);
  eq('صالحة', s.isValid, true);
}
{
  // عرس قبل البداية → غير صالح
  const s = computeFromWeddingDate(d(2026, 1, 1), d(2026, 2, 1), d(2026, 1, 1));
  eq('عرس قبل البداية غير صالح', s.isValid, false);
}
{
  // عرس = البداية → غير صالح (0 يوم)
  const s = computeFromWeddingDate(d(2026, 1, 1), d(2026, 1, 1), d(2026, 1, 1));
  eq('عرس = البداية غير صالح', s.isValid, false);
}
{
  // عرس قريب جداً (أقل من 39 يوماً) → غير صالح
  const s = computeFromWeddingDate(d(2026, 1, 20), d(2026, 1, 1), d(2026, 1, 1));
  eq('مدة أقصر من 39 غير صالحة', s.isValid, false);
}
{
  // تاريخ غير صالح
  const s = computeFromWeddingDate(new Date('invalid'), d(2026, 1, 1), d(2026, 1, 1));
  eq('تاريخ غير صالح يُرفض', s.isValid, false);
}
{
  // مدة غير صحيحة (عشرية)
  const s = computeFromDuration(45.5, d(2026, 1, 1), d(2026, 1, 1));
  eq('مدة عشرية مرفوضة', s.isValid, false);
}

console.log(`\nالثوابت: FIXED_TOTAL=${FIXED_TOTAL}, HARD_MINIMUM_DAYS=${HARD_MINIMUM_DAYS}`);
console.log(`\nالنتيجة: ${passed} ناجح، ${failed} فاشل`);
if (failed > 0) process.exit(1);
