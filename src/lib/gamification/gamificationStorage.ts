import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompletedByDate } from './gamificationEngine';
import {
  cloudLoadCompletedLog,
  cloudSaveCompletedLog,
  cloudLoadBadges,
  cloudSaveBadges,
} from '@/lib/auth/cloudSync';

const LOG_KEY = '@fullcare/gami_log_v1';
const BADGES_KEY = '@fullcare/gami_badges_v1';
const HABSA_DONE_KEY = '@fullcare/gami_habsa_done_v1';

let _userId: string | null = null;
export function setStorageUserId(id: string | null) {
  _userId = id;
}

// ─── سجلّ المهام ───

export async function loadCompletedLog(): Promise<CompletedByDate> {
  if (_userId) {
    try {
      return await cloudLoadCompletedLog(_userId);
    } catch {
      // fallback to local
    }
  }
  try {
    const raw = await AsyncStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as CompletedByDate) : {};
  } catch {
    return {};
  }
}

export async function saveCompletedLog(log: CompletedByDate): Promise<void> {
  await AsyncStorage.setItem(LOG_KEY, JSON.stringify(log));
  if (_userId) {
    cloudSaveCompletedLog(_userId, log).catch(() => {});
  }
}

// ─── الشارات ───

export async function loadUnlockedBadges(): Promise<string[]> {
  if (_userId) {
    try {
      const { badgeIds } = await cloudLoadBadges(_userId);
      return badgeIds;
    } catch {
      // fallback to local
    }
  }
  try {
    const raw = await AsyncStorage.getItem(BADGES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveUnlockedBadges(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(ids));
  if (_userId) {
    loadHabsaCompletedFlag().then((habsaDone) => {
      cloudSaveBadges(_userId!, ids, habsaDone).catch(() => {});
    });
  }
}

// ─── علم اكتمال الحَبْسَة ───

export async function loadHabsaCompletedFlag(): Promise<boolean> {
  if (_userId) {
    try {
      const { habsaDone } = await cloudLoadBadges(_userId);
      return habsaDone;
    } catch {
      // fallback to local
    }
  }
  try {
    return (await AsyncStorage.getItem(HABSA_DONE_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function saveHabsaCompletedFlag(done: boolean): Promise<void> {
  await AsyncStorage.setItem(HABSA_DONE_KEY, done ? '1' : '0');
  if (_userId) {
    loadUnlockedBadges().then((ids) => {
      cloudSaveBadges(_userId!, ids, done).catch(() => {});
    });
  }
}
