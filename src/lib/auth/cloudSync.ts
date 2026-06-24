import { supabase } from '@/lib/supabase';
import type { HabsaConfig } from '@/lib/habsa/habsaStorage';
import type { CompletedByDate } from '@/lib/gamification/gamificationEngine';

// ─── حَبْسَة ───

export async function cloudLoadHabsaConfig(userId: string): Promise<HabsaConfig | null> {
  const { data } = await supabase
    .from('habsa_configs')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (!data) return null;
  return {
    mode: data.mode as HabsaConfig['mode'],
    startDateISO: data.start_date_iso,
    weddingDateISO: data.wedding_date_iso ?? undefined,
    totalDays: data.total_days ?? undefined,
    createdAtISO: data.created_at_iso,
  };
}

export async function cloudSaveHabsaConfig(userId: string, config: HabsaConfig): Promise<void> {
  await supabase.from('habsa_configs').upsert({
    user_id: userId,
    mode: config.mode,
    start_date_iso: config.startDateISO,
    wedding_date_iso: config.weddingDateISO ?? null,
    total_days: config.totalDays ?? null,
    created_at_iso: config.createdAtISO,
    updated_at: new Date().toISOString(),
  });
}

export async function cloudClearHabsaConfig(userId: string): Promise<void> {
  await supabase.from('habsa_configs').delete().eq('user_id', userId);
}

// ─── سجلّ المهام ───

export async function cloudLoadCompletedLog(userId: string): Promise<CompletedByDate> {
  const { data } = await supabase
    .from('completed_tasks')
    .select('date_iso, task_ids')
    .eq('user_id', userId);
  if (!data) return {};
  const log: CompletedByDate = {};
  for (const row of data) {
    const ids = row.task_ids as string[];
    if (ids.length > 0) log[row.date_iso] = ids;
  }
  return log;
}

export async function cloudSaveCompletedLog(userId: string, log: CompletedByDate): Promise<void> {
  const rows = Object.entries(log).map(([dateIso, taskIds]) => ({
    user_id: userId,
    date_iso: dateIso,
    task_ids: taskIds,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length === 0) {
    await supabase.from('completed_tasks').delete().eq('user_id', userId);
    return;
  }
  await supabase.from('completed_tasks').upsert(rows);
}

// ─── الشارات ───

export async function cloudLoadBadges(userId: string): Promise<{ badgeIds: string[]; habsaDone: boolean }> {
  const { data } = await supabase
    .from('unlocked_badges')
    .select('badge_ids, habsa_completed')
    .eq('user_id', userId)
    .single();
  if (!data) return { badgeIds: [], habsaDone: false };
  return {
    badgeIds: data.badge_ids as string[],
    habsaDone: data.habsa_completed,
  };
}

export async function cloudSaveBadges(userId: string, badgeIds: string[], habsaDone: boolean): Promise<void> {
  await supabase.from('unlocked_badges').upsert({
    user_id: userId,
    badge_ids: badgeIds,
    habsa_completed: habsaDone,
    updated_at: new Date().toISOString(),
  });
}

// ─── رفع البيانات المحلية للسحابة عند أول تسجيل دخول ───

export async function uploadLocalDataToCloud(
  userId: string,
  habsaConfig: HabsaConfig | null,
  completedLog: CompletedByDate,
  badgeIds: string[],
  habsaDone: boolean,
): Promise<void> {
  const promises: Promise<void>[] = [];

  if (habsaConfig) {
    promises.push(cloudSaveHabsaConfig(userId, habsaConfig));
  }

  if (Object.keys(completedLog).length > 0) {
    promises.push(cloudSaveCompletedLog(userId, completedLog));
  }

  if (badgeIds.length > 0 || habsaDone) {
    promises.push(cloudSaveBadges(userId, badgeIds, habsaDone));
  }

  await Promise.all(promises);
}
