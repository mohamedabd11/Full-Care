/** أدوات تاريخ بسيطة تتعامل مع التاريخ المحلي (بلا أثر مناطق زمنية). */

/** يحوّل Date إلى نص ISO لليوم المحلي: YYYY-MM-DD */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** يحوّل نص ISO (YYYY-MM-DD) إلى Date عند منتصف الليل المحلي */
export function fromISODate(s: string): Date {
  const [y, m, day] = s.split('-').map((n) => parseInt(n, 10));
  return new Date(y, m - 1, day);
}

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/** صياغة عربية مقروءة: 9 فبراير 2026 */
export function formatArabicDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;
}
