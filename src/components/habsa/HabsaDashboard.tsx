import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import type { HabsaState } from '@/lib/habsa/habsaEngine';
import { STAGE_CONTENT, SMOKE_GRADUAL_SCHEDULE } from '@/data/habsaContent';
import { useGamification } from '@/lib/gamification/GamificationContext';
import { POINTS_PER_TASK } from '@/lib/gamification/gamificationEngine';

export function HabsaDashboard({
  state,
  onReset,
}: {
  state: HabsaState;
  onReset: () => void;
}) {
  const { isTaskDone, toggleTask, reportHabsaCompleted } = useGamification();
  const stage = state.currentStage;
  const content = stage ? STAGE_CONTENT[stage.key] : null;

  // اليوم داخل المرحلة الحالية (1-based)
  const dayWithinStage = stage ? state.currentDay - stage.startDay + 1 : 0;

  // عند اكتمال الرحلة تُمنح شارة "عروس مكتملة"
  useEffect(() => {
    if (state.status === 'completed') reportHabsaCompleted();
  }, [state.status, reportHabsaCompleted]);

  return (
    <View>
      {/* ترويسة التقدّم */}
      <View style={{ backgroundColor: colors.primary, borderRadius: 24, padding: 22 }}>
        {state.status === 'not_started' ? (
          <AppText weight="bold" style={{ fontSize: 18, color: colors.white }}>
            لم تبدأ الحَبْسَة بعد
          </AppText>
        ) : state.status === 'completed' ? (
          <AppText weight="bold" style={{ fontSize: 20, color: colors.white }}>
            اكتملت رحلتكِ — مبروك! 🎉
          </AppText>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AppText style={{ fontSize: 26 }}>{content?.emoji}</AppText>
              <AppText weight="bold" style={{ fontSize: 20, color: colors.white }}>
                {content?.nameAr}
              </AppText>
            </View>
            <AppText style={{ fontSize: 14, color: colors.white, marginTop: 10 }}>
              اليوم {state.currentDay} من {state.totalDays} · متبقٍّ {state.daysRemaining} يوماً
            </AppText>
          </>
        )}

        {/* شريط التقدّم */}
        <View style={{ height: 10, backgroundColor: colors.primaryDark, borderRadius: 6, marginTop: 14, overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              width: `${state.progressPercent}%`,
              backgroundColor: colors.accent,
              borderRadius: 6,
            }}
          />
        </View>
        <AppText style={{ fontSize: 12, color: colors.white, marginTop: 6 }}>
          {state.progressPercent}%
        </AppText>
      </View>

      {/* الخط الزمني للمراحل */}
      <AppText weight="bold" style={{ fontSize: 18, color: colors.ink, marginTop: 24 }}>
        المراحل
      </AppText>
      <View style={{ marginTop: 12, gap: 8 }}>
        {state.allStages.map((s) => {
          const isCurrent = stage?.key === s.key;
          const isDone = state.currentDay > s.endDay;
          const c = STAGE_CONTENT[s.key];
          return (
            <View
              key={s.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isCurrent ? colors.primaryLight : colors.white,
                borderRadius: 16,
                padding: 14,
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isDone ? colors.accent : isCurrent ? colors.primary : colors.cream,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={18} color={colors.white} />
                ) : (
                  <AppText style={{ fontSize: 16 }}>{c.emoji}</AppText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold" style={{ fontSize: 15, color: colors.ink }}>
                  {c.nameAr}
                </AppText>
                <AppText style={{ fontSize: 12, color: colors.muted }}>
                  أيام {s.startDay}–{s.endDay} ({s.durationDays} يوماً)
                </AppText>
              </View>
            </View>
          );
        })}
      </View>

      {/* إرشاد اليوم */}
      {content && state.status === 'active' && (
        <View style={{ marginTop: 24, backgroundColor: colors.white, borderRadius: 20, padding: 18 }}>
          <AppText weight="bold" style={{ fontSize: 17, color: colors.ink }}>
            إرشاد اليوم
          </AppText>
          <AppText style={{ fontSize: 14, color: colors.ink, marginTop: 8, lineHeight: 26 }}>
            {content.overviewAr}
          </AppText>

          {/* تفصيل يومي حرج للمرحلة 2 */}
          {stage?.key === 'smokeGradual' && (
            <View style={{ marginTop: 14, backgroundColor: colors.cream, borderRadius: 14, padding: 14 }}>
              <AppText weight="semibold" style={{ fontSize: 14, color: colors.primaryDark }}>
                جدول اليوم {dayWithinStage}
              </AppText>
              {(() => {
                const idx = Math.min(Math.max(dayWithinStage, 1), SMOKE_GRADUAL_SCHEDULE.length) - 1;
                const sched = SMOKE_GRADUAL_SCHEDULE[idx];
                return (
                  <AppText style={{ fontSize: 14, color: colors.ink, marginTop: 6, lineHeight: 24 }}>
                    {sched.woodAr} · {sched.durationAr}
                  </AppText>
                );
              })()}
            </View>
          )}

          {/* مهام اليوم القابلة للإنجاز */}
          <AppText weight="semibold" style={{ fontSize: 14, color: colors.ink, marginTop: 16 }}>
            مهام اليوم <AppText style={{ fontSize: 12, color: colors.accent }}>(+{POINTS_PER_TASK} لكل مهمة)</AppText>
          </AppText>
          <View style={{ marginTop: 10, gap: 8 }}>
            {content.principlesAr.map((p, i) => {
              const taskId = `habsa:${stage!.key}:${i}`;
              const done = isTaskDone(taskId);
              return (
                <Pressable
                  key={i}
                  onPress={() => toggleTask(taskId)}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    backgroundColor: done ? colors.accentLight : colors.cream,
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={done ? colors.accentDark : colors.muted}
                  />
                  <AppText
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: colors.ink,
                      lineHeight: 24,
                      textDecorationLine: done ? 'line-through' : 'none',
                    }}
                  >
                    {p}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {/* تنبيه السلامة */}
          <View style={{ marginTop: 14, flexDirection: 'row', gap: 8, backgroundColor: '#FEF6E7', borderRadius: 12, padding: 12 }}>
            <Ionicons name="shield-checkmark" size={18} color={colors.accentDark} />
            <AppText style={{ flex: 1, fontSize: 12.5, color: colors.ink, lineHeight: 22 }}>
              {content.safetyAr}
            </AppText>
          </View>
        </View>
      )}

      <Button
        label="إعادة تعيين الحَبْسَة"
        variant="outline"
        onPress={onReset}
        style={{ marginTop: 22 }}
      />
    </View>
  );
}
