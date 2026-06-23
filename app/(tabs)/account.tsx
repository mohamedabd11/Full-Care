import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";

const rows: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: "trophy", label: "نقاطي ومستواي" },
  { icon: "heart", label: "المفضلة" },
  { icon: "notifications", label: "التنبيهات" },
  { icon: "shield-checkmark", label: "الخصوصية والشروط" },
  { icon: "information-circle", label: "عن التطبيق" },
];

export default function AccountScreen() {
  return (
    <Screen>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: colors.primaryLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="person" size={42} color={colors.primaryDark} />
        </View>
        <AppText weight="bold" style={{ fontSize: 20, color: colors.ink, marginTop: 12 }}>
          ضيفة
        </AppText>
        <AppText style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
          سجّلي الدخول لحفظ تقدّمكِ
        </AppText>
      </View>

      <View style={{ marginTop: 26, gap: 10 }}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name={row.icon} size={22} color={colors.accent} />
            <AppText
              weight="semibold"
              style={{ fontSize: 15, color: colors.ink, marginRight: 14, flex: 1 }}
            >
              {row.label}
            </AppText>
            <Ionicons name="chevron-back" size={20} color={colors.muted} />
          </View>
        ))}
      </View>
    </Screen>
  );
}
