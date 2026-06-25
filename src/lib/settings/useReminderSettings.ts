/**
 * تفضيلات التذكير اليومي (محلية).
 * تُحفظ النية والوقت محلياً؛ الجدولة الفعلية للإشعارات تُفعَّل في نسخة APK
 * (إشعارات Expo Go محدودة على أندرويد).
 */
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@fullcare/reminder_v1";

export interface ReminderSettings {
  enabled: boolean;
  /** ساعة التذكير 0–23 */
  hour: number;
  /** دقيقة التذكير 0–59 */
  minute: number;
}

const DEFAULT: ReminderSettings = { enabled: false, hour: 20, minute: 0 };

export function useReminderSettings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted && raw) setSettings({ ...DEFAULT, ...JSON.parse(raw) });
      } catch {
        // نكمل بالقيم الافتراضية
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const update = useCallback((patch: Partial<ReminderSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { loading, settings, update };
}
