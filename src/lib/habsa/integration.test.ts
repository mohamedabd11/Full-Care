/**
 * اختبارات تكامل: التواريخ + مسار (الإعداد → الحالة) كما يفعله useHabsa.
 * تشغيل: node src/lib/habsa/integration.test.ts
 */
import { toISODate, fromISODate, formatArabicDate } from './dateUtils.ts';
import {
  computeFromDuration,
  computeFromWeddingDate,
  type HabsaState,
} from './habsaEngine.ts';
import type { HabsaConfig } from './habsaStorage.ts';

let passed = 0;
let failed = 0;
function eq<T>(name: string, actual: T, expected: T) {
  const ok = actual === expected;
  ok ? passed++ : failed++;
  console.log(`  ${ok ? '✓' : '✗ FAIL:'} ${name} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`);
}

const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);

console.log('— dateUtils —');
eq('toISODate يصفّر اليوم', toISODate(new Date(2026, 1, 9, 15, 30)), '2026-02-09');
eq('fromISODate يعيد نفس اليوم', toISODate(fromISODate('2026-02-09')), '2026-02-09');
eq('رحلة ذهاب-إياب', toISODate(fromISODate('2026-12-31')), '2026-12-31');
eq('صياغة عربية', formatArabicDate(d(2026, 2, 9)), '9 فبراير 2026');

// يحاكي computeState داخل useHabsa
function computeState(config: HabsaConfig, today: Date): HabsaState {
  const startDate = fromISODate(config.startDateISO);
  if (config.mode === 'wedding_date' && config.weddingDateISO) {
    return computeFromWeddingDate(fromISODate(config.weddingDateISO), startDate, today);
  }
  return computeFromDuration(config.totalDays ?? 0, startDate, today);
}

console.log('— مسار الإعداد → الحالة —');
{
  const config: HabsaConfig = {
    mode: 'duration',
    startDateISO: '2026-01-01',
    totalDays: 60,
    createdAtISO: '2026-01-01T00:00:00Z',
  };
  const s = computeState(config, d(2026, 1, 1));
  eq('وضع المدة: صالح', s.isValid, true);
  eq('وضع المدة: المجموع 60', s.totalDays, 60);
  eq('وضع المدة: اليوم 1', s.currentDay, 1);
}
{
  const config: HabsaConfig = {
    mode: 'wedding_date',
    startDateISO: '2026-01-01',
    weddingDateISO: '2026-02-09', // 39 يوماً
    createdAtISO: '2026-01-01T00:00:00Z',
  };
  const s = computeState(config, d(2026, 1, 10));
  eq('وضع العرس: صالح', s.isValid, true);
  eq('وضع العرس: 39 يوماً', s.totalDays, 39);
  eq('وضع العرس: اليوم 10', s.currentDay, 10);
  eq('وضع العرس: مرحلة قلب الدخان غائبة (39 بالضبط)', s.allStages.length, 4);
}
{
  // عرس قريب جداً عبر مسار الإعداد → غير صالح
  const config: HabsaConfig = {
    mode: 'wedding_date',
    startDateISO: '2026-01-01',
    weddingDateISO: '2026-01-20',
    createdAtISO: '2026-01-01T00:00:00Z',
  };
  const s = computeState(config, d(2026, 1, 1));
  eq('عرس قريب: غير صالح', s.isValid, false);
}

console.log(`\nالنتيجة: ${passed} ناجح، ${failed} فاشل`);
if (failed > 0) process.exit(1);
