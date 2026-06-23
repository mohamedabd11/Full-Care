/**
 * حفظ بيانات التحفيز محلياً (AsyncStorage):
 * سجلّ المهام المكتملة حسب التاريخ + الشارات المفتوحة.
 * لاحقاً يمكن مزامنتها مع Supabase.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompletedByDate } from './gamificationEngine';

const LOG_KEY = '@fullcare/gami_log_v1';
const BADGES_KEY = '@fullcare/gami_badges_v1';
const HABSA_DONE_KEY = '@fullcare/gami_habsa_done_v1';

export async function loadCompletedLog(): Promise<CompletedByDate> {
  try {
    const raw = await AsyncStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as CompletedByDate) : {};
  } catch {
    return {};
  }
}

export async function saveCompletedLog(log: CompletedByDate): Promise<void> {
  await AsyncStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export async function loadUnlockedBadges(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(BADGES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveUnlockedBadges(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(ids));
}

export async function loadHabsaCompletedFlag(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(HABSA_DONE_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function saveHabsaCompletedFlag(done: boolean): Promise<void> {
  await AsyncStorage.setItem(HABSA_DONE_KEY, done ? '1' : '0');
}
