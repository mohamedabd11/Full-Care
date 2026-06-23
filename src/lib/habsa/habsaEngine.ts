/**
 * محرّك الحَبْسَة — قلب التطبيق
 * يحسب المرحلة الحالية، اليوم الحالي، الأيام المتبقية، والتقدّم
 * بناءً على تاريخ العرس أو مدة الحَبْسَة المختارة.
 *
 * هذا هو الهيكل المنطقي فقط. محتوى المهام اليومية يُقرأ من ملفات /content/habsa-stages.
 *
 * قرارات تصميمية مهمة (تحلّ أخطاء النسخة السابقة):
 *  1) الحد الأدنى الحقيقي للمدة = مجموع المراحل الثابتة (39 يوماً). أي مدة أقل
 *     لا يمكن أن تستوعب المراحل الثابتة، فتُعتبر غير صالحة (بدلاً من إنتاج جدول مكسور صامت).
 *  2) الفروق الزمنية تُحسب بالأيام التقويمية (بعد تصفير وقت اليوم) لتفادي مشاكل
 *     التوقيت الصيفي والمناطق الزمنية.
 *  3) كل المدخلات يجري التحقق منها (تواريخ صالحة، البداية قبل العرس، قيم موجبة).
 *  4) حدّ يوم العرس معرّف صراحةً: البرنامج يمتد من يوم البداية (يوم 1) حتى اليوم
 *     السابق للعرس مباشرة (يوم الحنة = آخر يوم في مرحلة الختام). يوم العرس نفسه
 *     لا يُحتسب ضمن أيام البرنامج.
 */

// ===== الثوابت (مستخرجة من مواصفات صاحب المشروع) =====
export const STAGE_DURATIONS = {
  preparation: 7, // المرحلة 1: التحضير
  smokeGradual: 7, // المرحلة 2: الدخان المتدرّج
  // smokeCore مرنة — تُحسب من المدة الإضافية
  preWedding: 20, // المرحلة 4: ما قبل العرس
  finale: 5, // المرحلة 5: الختام
} as const;

/** مجموع المراحل الثابتة = 7 + 7 + 20 + 5 = 39 يوماً */
export const FIXED_TOTAL =
  STAGE_DURATIONS.preparation +
  STAGE_DURATIONS.smokeGradual +
  STAGE_DURATIONS.preWedding +
  STAGE_DURATIONS.finale;

/**
 * الحد الأدنى الصارم للمدة الكلية. لا يمكن أن يقلّ عن مجموع المراحل الثابتة،
 * وإلا فلن تتّسع المدة للمراحل الثابتة. (يحلّ تعارض 30 مقابل 39 في النسخة السابقة.)
 */
export const HARD_MINIMUM_DAYS = FIXED_TOTAL;

export type StageKey =
  | 'preparation'
  | 'smokeGradual'
  | 'smokeCore'
  | 'preWedding'
  | 'finale';

export type HabsaStatus = 'not_started' | 'active' | 'completed' | 'invalid';

export interface StageInfo {
  key: StageKey;
  nameAr: string;
  startDay: number; // اليوم الذي تبدأ فيه المرحلة (1-based)
  endDay: number; // اليوم الذي تنتهي فيه (شامل)
  durationDays: number;
}

export interface HabsaState {
  totalDays: number;
  currentDay: number; // أي يوم نحن فيه الآن (1-based، مقيّد بين 1 والمجموع)
  daysRemaining: number;
  progressPercent: number; // 0-100
  currentStage: StageInfo | null; // null لو غير صالح
  allStages: StageInfo[];
  status: HabsaStatus;
  isValid: boolean;
  warning?: string; // رسالة توضيحية عند وجود مشكلة
}

const STAGE_NAMES_AR: Record<StageKey, string> = {
  preparation: 'التحضير',
  smokeGradual: 'الدخان المتدرّج',
  smokeCore: 'قلب الدخان',
  preWedding: 'ما قبل العرس',
  finale: 'الختام',
};

// ===== أدوات التاريخ =====

/** هل التاريخ صالح (Date حقيقي وليس Invalid Date)؟ */
function isValidDate(d: unknown): d is Date {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

/** ينسخ التاريخ مع تصفير الوقت إلى منتصف الليل المحلي (يلغي أثر الساعات والمناطق الزمنية). */
function atLocalMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * عدد الأيام التقويمية من a إلى b (b − a).
 * يحسب بعد تصفير الوقت، ويستخدم round لتفادي انزلاق التوقيت الصيفي.
 * موجب لو b بعد a، صفر لو نفس اليوم، سالب لو b قبل a.
 */
export function calendarDaysBetween(a: Date, b: Date): number {
  const ms = atLocalMidnight(b).getTime() - atLocalMidnight(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// ===== بناء المراحل =====

/**
 * يبني قائمة المراحل بناءً على المدة الكلية.
 * كل المدة الإضافية فوق المراحل الثابتة تذهب لـ"قلب الدخان".
 * يفترض أن totalDays >= HARD_MINIMUM_DAYS (يتحقق المتصل من ذلك مسبقاً).
 */
function buildStages(totalDays: number): StageInfo[] {
  const smokeCoreDays = Math.max(0, totalDays - FIXED_TOTAL);

  const order: { key: StageKey; duration: number }[] = [
    { key: 'preparation', duration: STAGE_DURATIONS.preparation },
    { key: 'smokeGradual', duration: STAGE_DURATIONS.smokeGradual },
    { key: 'smokeCore', duration: smokeCoreDays },
    { key: 'preWedding', duration: STAGE_DURATIONS.preWedding },
    { key: 'finale', duration: STAGE_DURATIONS.finale },
  ];

  const stages: StageInfo[] = [];
  let cursor = 1;
  for (const s of order) {
    if (s.duration <= 0) continue; // تخطّى قلب الدخان لو صفر (المدة = 39 بالضبط)
    stages.push({
      key: s.key,
      nameAr: STAGE_NAMES_AR[s.key],
      startDay: cursor,
      endDay: cursor + s.duration - 1,
      durationDays: s.duration,
    });
    cursor += s.duration;
  }
  return stages;
}

// ===== حالات غير صالحة =====

function invalidState(warning: string): HabsaState {
  return {
    totalDays: 0,
    currentDay: 0,
    daysRemaining: 0,
    progressPercent: 0,
    currentStage: null,
    allStages: [],
    status: 'invalid',
    isValid: false,
    warning,
  };
}

// ===== الواجهات العامة =====

/** الوضع الأول: العروس تُدخل مدة الحَبْسَة بالأيام */
export function computeFromDuration(
  totalDays: number,
  startDate: Date,
  today: Date = new Date()
): HabsaState {
  // التحقق من المدخلات
  if (!Number.isFinite(totalDays) || !Number.isInteger(totalDays)) {
    return invalidState('المدة يجب أن تكون عدداً صحيحاً من الأيام.');
  }
  if (totalDays < HARD_MINIMUM_DAYS) {
    return invalidState(
      `المدة المختارة (${totalDays} يوماً) أقصر من الحد الأدنى اللازم (${HARD_MINIMUM_DAYS} يوماً). ` +
        `المراحل الثابتة وحدها (تحضير + دخان متدرّج + ما قبل العرس + ختام) تحتاج ${FIXED_TOTAL} يوماً.`
    );
  }
  if (!isValidDate(startDate) || !isValidDate(today)) {
    return invalidState('تاريخ غير صالح.');
  }

  const stages = buildStages(totalDays);
  // اليوم الحالي 1-based: يوم البداية = يوم 1
  const rawCurrentDay = calendarDaysBetween(startDate, today) + 1;

  return assemble(totalDays, rawCurrentDay, stages);
}

/** الوضع الثاني: العروس تُدخل تاريخ العرس */
export function computeFromWeddingDate(
  weddingDate: Date,
  startDate: Date,
  today: Date = new Date()
): HabsaState {
  if (!isValidDate(weddingDate) || !isValidDate(startDate) || !isValidDate(today)) {
    return invalidState('تاريخ غير صالح.');
  }

  // يوم العرس لا يُحتسب ضمن أيام البرنامج؛ آخر يوم = اليوم السابق للعرس.
  const totalDays = calendarDaysBetween(startDate, weddingDate);

  if (totalDays <= 0) {
    return invalidState('تاريخ العرس يجب أن يكون بعد تاريخ بداية الحَبْسَة.');
  }

  return computeFromDuration(totalDays, startDate, today);
}

// ===== التجميع النهائي =====

function assemble(
  totalDays: number,
  rawCurrentDay: number,
  stages: StageInfo[]
): HabsaState {
  // تحديد الحالة قبل التقييد
  let status: HabsaStatus;
  if (rawCurrentDay < 1) {
    status = 'not_started';
  } else if (rawCurrentDay > totalDays) {
    status = 'completed';
  } else {
    status = 'active';
  }

  const clampedDay = Math.min(Math.max(rawCurrentDay, 1), totalDays);
  const currentStage =
    stages.find((s) => clampedDay >= s.startDay && clampedDay <= s.endDay) ??
    stages[stages.length - 1];

  return {
    totalDays,
    currentDay: clampedDay,
    daysRemaining: Math.max(0, totalDays - clampedDay),
    progressPercent: Math.round((clampedDay / totalDays) * 100),
    currentStage,
    allStages: stages,
    status,
    isValid: true,
    warning:
      status === 'not_started'
        ? 'لم تبدأ الحَبْسَة بعد — تبدأ في تاريخ البداية المحدّد.'
        : status === 'completed'
          ? 'اكتملت رحلة الحَبْسَة. مبروك! 🌸'
          : undefined,
  };
}
