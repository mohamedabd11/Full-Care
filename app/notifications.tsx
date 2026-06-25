import { useState } from "react";
import { Pressable, Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";
import { useReminderSettings } from "@/lib/settings/useReminderSettings";

// خيارات أوقات جاهزة (صباح / ظهر / مساء / ليل)
const TIME_PRESETS: { label: string; hour: number; minute: number }[] = [
  { label: "صباحاً 8:00", hour: 8, minute: 0 },
  { label: "ظهراً 1:00", hour: 13, minute: 0 },
  { label: "مساءً 8:00", hour: 20, minute: 0 },
  { label: "ليلاً 10:00", hour: 22, minute: 0 },
];

export default function NotificationsScreen() {
  const { settings, update } = useReminderSettings();
  const [savedHint, setSavedHint] = useState(false);

  function pickTime(hour: number, minute: number) {
    update({ hour, minute });
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 1500);
  }

  const isSelected = (h: number, m: number) => settings.hour === h && settings.minute === m;

  return (
    <Screen>
      <ScreenHeader title="التنبيهات" icon="notifications" />

      {/* تفعيل التذكير */}
      <View
        style={{
          backgroundColor: colors.white,
          borderRadius: 18,
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText weight="semibold" style={{ fontSize: 16, color: colors.ink }}>
            تذكير العناية اليومي
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 22 }}>
            نُذكّركِ يومياً بإكمال مهام عنايتكِ
          </AppText>
        </View>
        <Switch
          value={settings.enabled}
          onValueChange={(v) => update({ enabled: v })}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={settings.enabled ? colors.primary : "#FFFFFF"}
        />
      </View>

      {/* اختيار الوقت */}
      {settings.enabled && (
        <View style={{ marginTop: 20 }}>
          <AppText weight="bold" style={{ fontSize: 16, color: colors.ink, marginBottom: 12 }}>
            وقت التذكير
          </AppText>
          <View style={{ gap: 10 }}>
            {TIME_PRESETS.map((t) => {
              const selected = isSelected(t.hour, t.minute);
              return (
                <Pressable
                  key={t.label}
                  onPress={() => pickTime(t.hour, t.minute)}
                  style={{
                    backgroundColor: selected ? colors.primaryLight : colors.white,
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={selected ? colors.primaryDark : colors.muted}
                  />
                  <AppText
                    weight="semibold"
                    style={{ fontSize: 15, color: colors.ink, marginRight: 12, flex: 1 }}
                  >
                    {t.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {savedHint && (
            <AppText style={{ fontSize: 13, color: colors.accentDark, marginTop: 12, textAlign: "center" }}>
              ✓ تم حفظ الوقت
            </AppText>
          )}
        </View>
      )}

      {/* ملاحظة */}
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          gap: 8,
          backgroundColor: "#FEF6E7",
          borderRadius: 12,
          padding: 14,
        }}
      >
        <Ionicons name="information-circle" size={18} color={colors.accentDark} />
        <AppText style={{ flex: 1, fontSize: 12.5, color: colors.ink, lineHeight: 22 }}>
          يُحفظ تفضيلكِ الآن. التذكيرات الفعلية تُفعَّل في النسخة المثبّتة من التطبيق (APK).
        </AppText>
      </View>
    </Screen>
  );
}
