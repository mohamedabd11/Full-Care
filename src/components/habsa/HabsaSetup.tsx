import { useMemo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import {
  computeFromDuration,
  computeFromWeddingDate,
  HARD_MINIMUM_DAYS,
} from '@/lib/habsa/habsaEngine';
import { toISODate, formatArabicDate } from '@/lib/habsa/dateUtils';
import type { HabsaConfig, HabsaMode } from '@/lib/habsa/habsaStorage';

const DURATION_PRESETS = [HARD_MINIMUM_DAYS, 60, 90, 120];

export function HabsaSetup({ onConfirm }: { onConfirm: (c: HabsaConfig) => void }) {
  const today = useMemo(() => new Date(), []);
  const [mode, setMode] = useState<HabsaMode>('duration');
  const [totalDays, setTotalDays] = useState(60);
  const [weddingDate, setWeddingDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);

  // معاينة حيّة لنتيجة الإدخال قبل التأكيد
  const preview = useMemo(() => {
    return mode === 'duration'
      ? computeFromDuration(totalDays, today, today)
      : computeFromWeddingDate(weddingDate, today, today);
  }, [mode, totalDays, weddingDate, today]);

  function confirm() {
    if (!preview.isValid) return;
    const base = { startDateISO: toISODate(today), createdAtISO: new Date().toISOString() };
    onConfirm(
      mode === 'duration'
        ? { ...base, mode, totalDays }
        : { ...base, mode, weddingDateISO: toISODate(weddingDate) }
    );
  }

  return (
    <View>
      <AppText weight="bold" style={{ fontSize: 22, color: colors.ink }}>
        لنبدأ رحلتكِ 🌸
      </AppText>
      <AppText style={{ fontSize: 14, color: colors.muted, marginTop: 6, lineHeight: 24 }}>
        اختاري طريقة التحديد، ونحسب لكِ المراحل واليوم الحالي تلقائياً.
      </AppText>

      {/* اختيار الوضع */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <ModeTab
          active={mode === 'duration'}
          label="بعدد الأيام"
          icon="calendar-number"
          onPress={() => setMode('duration')}
        />
        <ModeTab
          active={mode === 'wedding_date'}
          label="بتاريخ العرس"
          icon="heart"
          onPress={() => setMode('wedding_date')}
        />
      </View>

      {/* محتوى الوضع */}
      <View
        style={{
          marginTop: 16,
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: 18,
        }}
      >
        {mode === 'duration' ? (
          <View>
            <AppText weight="semibold" style={{ fontSize: 15, color: colors.ink }}>
              مدة الحَبْسَة
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginVertical: 14 }}>
              <Stepper icon="remove" onPress={() => setTotalDays((d) => Math.max(HARD_MINIMUM_DAYS, d - 1))} />
              <View style={{ alignItems: 'center', minWidth: 90 }}>
                <AppText weight="bold" style={{ fontSize: 36, color: colors.primaryDark, textAlign: 'center' }}>
                  {totalDays}
                </AppText>
                <AppText style={{ fontSize: 13, color: colors.muted }}>يوماً</AppText>
              </View>
              <Stepper icon="add" onPress={() => setTotalDays((d) => d + 1)} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {DURATION_PRESETS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => setTotalDays(p)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    backgroundColor: totalDays === p ? colors.primaryLight : colors.cream,
                  }}
                >
                  <AppText weight="semibold" style={{ fontSize: 13, color: colors.ink }}>
                    {p}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <AppText weight="semibold" style={{ fontSize: 15, color: colors.ink }}>
              تاريخ العرس
            </AppText>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.cream,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <AppText weight="semibold" style={{ fontSize: 16, color: colors.primaryDark }}>
                {formatArabicDate(weddingDate)}
              </AppText>
              <Ionicons name="calendar" size={22} color={colors.accent} />
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={weddingDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={today}
                onChange={(_, date) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (date) setWeddingDate(date);
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* المعاينة الحيّة */}
      <PreviewBox
        valid={preview.isValid}
        totalDays={preview.totalDays}
        stagesCount={preview.allStages.length}
        warning={preview.warning}
      />

      <Button
        label="ابدئي رحلتكِ"
        onPress={confirm}
        disabled={!preview.isValid}
        style={{ marginTop: 18 }}
      />
      <AppText style={{ fontSize: 12, color: colors.muted, marginTop: 10, textAlign: 'center' }}>
        تبدأ الحَبْسَة من اليوم. يمكنكِ إعادة التعيين لاحقاً.
      </AppText>
    </View>
  );
}

function ModeTab({
  active,
  label,
  icon,
  onPress,
}: {
  active: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: active ? colors.primary : colors.white,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        gap: 6,
      }}
    >
      <Ionicons name={icon} size={22} color={active ? colors.white : colors.muted} />
      <AppText weight="semibold" style={{ fontSize: 14, color: active ? colors.white : colors.ink }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function Stepper({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: colors.cream,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={icon} size={24} color={colors.primaryDark} />
    </Pressable>
  );
}

function PreviewBox({
  valid,
  totalDays,
  stagesCount,
  warning,
}: {
  valid: boolean;
  totalDays: number;
  stagesCount: number;
  warning?: string;
}) {
  if (!valid) {
    return (
      <View
        style={{
          marginTop: 16,
          backgroundColor: '#FDECEA',
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Ionicons name="alert-circle" size={20} color="#C0392B" />
        <AppText style={{ flex: 1, fontSize: 13, color: '#C0392B', lineHeight: 22 }}>
          {warning}
        </AppText>
      </View>
    );
  }
  return (
    <View
      style={{
        marginTop: 16,
        backgroundColor: colors.accentLight,
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        gap: 10,
      }}
    >
      <Ionicons name="checkmark-circle" size={20} color={colors.accentDark} />
      <AppText style={{ flex: 1, fontSize: 13, color: colors.ink, lineHeight: 22 }}>
        رحلتكِ ستكون {totalDays} يوماً عبر {stagesCount} مراحل.
      </AppText>
    </View>
  );
}
