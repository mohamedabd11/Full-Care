import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  cloudLoadHabsaConfig,
  cloudSaveHabsaConfig,
  cloudClearHabsaConfig,
} from '@/lib/auth/cloudSync';

const STORAGE_KEY = '@fullcare/habsa_config_v1';

export type HabsaMode = 'wedding_date' | 'duration';

export interface HabsaConfig {
  mode: HabsaMode;
  startDateISO: string;
  weddingDateISO?: string;
  totalDays?: number;
  createdAtISO: string;
}

let _userId: string | null = null;
export function setHabsaStorageUserId(id: string | null) {
  _userId = id;
}

export async function loadHabsaConfig(): Promise<HabsaConfig | null> {
  if (_userId) {
    try {
      const cloud = await cloudLoadHabsaConfig(_userId);
      if (cloud) return cloud;
    } catch {
      // fallback to local
    }
  }
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
  if (_userId) {
    cloudSaveHabsaConfig(_userId, config).catch(() => {});
  }
}

export async function clearHabsaConfig(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  if (_userId) {
    cloudClearHabsaConfig(_userId).catch(() => {});
  }
}
