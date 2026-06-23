/**
 * حفظ إعدادات الحَبْسَة محلياً على الجهاز (AsyncStorage).
 * لاحقاً يمكن مزامنتها مع Supabase عند تسجيل الدخول.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@fullcare/habsa_config_v1';

export type HabsaMode = 'wedding_date' | 'duration';

export interface HabsaConfig {
  mode: HabsaMode;
  /** تاريخ بداية الحَبْسَة بصيغة ISO (YYYY-MM-DD) */
  startDateISO: string;
  /** تاريخ العرس (في وضع wedding_date) */
  weddingDateISO?: string;
  /** المدة بالأيام (في وضع duration) */
  totalDays?: number;
  /** وقت الإنشاء للمرجعية */
  createdAtISO: string;
}

export async function loadHabsaConfig(): Promise<HabsaConfig | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HabsaConfig;
  } catch {
    return null;
  }
}

export async function saveHabsaConfig(config: HabsaConfig): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function clearHabsaConfig(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
