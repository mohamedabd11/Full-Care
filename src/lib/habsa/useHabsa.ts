/**
 * خطّاف يربط إعدادات الحَبْسَة المحفوظة بمحرّك الحساب.
 * يحمّل الإعداد عند البدء، يحسب الحالة الحالية، ويوفّر إجراءات الحفظ وإعادة التعيين.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  computeFromDuration,
  computeFromWeddingDate,
  type HabsaState,
} from './habsaEngine';
import {
  loadHabsaConfig,
  saveHabsaConfig,
  clearHabsaConfig,
  type HabsaConfig,
} from './habsaStorage';
import { fromISODate } from './dateUtils';

interface UseHabsa {
  loading: boolean;
  config: HabsaConfig | null;
  state: HabsaState | null;
  setup: (config: HabsaConfig) => Promise<void>;
  reset: () => Promise<void>;
}

function computeState(config: HabsaConfig, today: Date): HabsaState {
  const startDate = fromISODate(config.startDateISO);
  if (config.mode === 'wedding_date' && config.weddingDateISO) {
    return computeFromWeddingDate(fromISODate(config.weddingDateISO), startDate, today);
  }
  return computeFromDuration(config.totalDays ?? 0, startDate, today);
}

export function useHabsa(): UseHabsa {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<HabsaConfig | null>(null);
  const [state, setState] = useState<HabsaState | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await loadHabsaConfig();
      if (!mounted) return;
      setConfig(saved);
      setState(saved ? computeState(saved, new Date()) : null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setup = useCallback(async (newConfig: HabsaConfig) => {
    await saveHabsaConfig(newConfig);
    setConfig(newConfig);
    setState(computeState(newConfig, new Date()));
  }, []);

  const reset = useCallback(async () => {
    await clearHabsaConfig();
    setConfig(null);
    setState(null);
  }, []);

  return { loading, config, state, setup, reset };
}
