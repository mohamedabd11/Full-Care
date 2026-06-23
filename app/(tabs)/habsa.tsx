import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";

const stages = [
  { n: 1, name: "التحضير والترطيب" },
  { n: 2, name: "الدخان المتدرّج" },
  { n: 3, name: "قلب الدخان" },
  { n: 4, name: "ما قبل العرس" },
  { n: 5, name: "الختام ويوم الحنة" },
];

export default function HabsaScreen() {
  return (
    <Screen>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="flame" size={36} color={colors.white} />
        </View>
        <AppText weight="bold" style={{ fontSize: 24, color: colors.ink, marginTop: 14 }}>
          حَبْسَة العروس
        </AppText>
        <AppText
          style={{ fontSize: 14, color: colors.muted, marginTop: 6, textAlign: "center" }}
        >
          رحلة التجهيز السودانية الكاملة في خمس مراحل
        </AppText>
      </View>

      <View style={{ marginTop: 26, gap: 12 }}>
        {stages.map((stage) => (
          <View
            key={stage.n}
            style={{
              backgroundColor: colors.white,
              borderRadius: 18,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: colors.accentLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText weight="bold" style={{ fontSize: 16, color: colors.accentDark }}>
                {stage.n}
              </AppText>
            </View>
            <AppText
              weight="semibold"
              style={{ fontSize: 16, color: colors.ink, marginRight: 14, flex: 1 }}
            >
              {stage.name}
            </AppText>
          </View>
        ))}
      </View>

      <View
        style={{
          marginTop: 24,
          backgroundColor: colors.accent,
          borderRadius: 20,
          padding: 18,
          alignItems: "center",
        }}
      >
        <AppText weight="bold" style={{ fontSize: 16, color: colors.white }}>
          باقة مدفوعة — قريباً
        </AppText>
      </View>
    </Screen>
  );
}
