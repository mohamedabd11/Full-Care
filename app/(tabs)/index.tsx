import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";
import { ProgressCard } from "@/components/gamification/ProgressCard";

export default function HomeScreen() {
  return (
    <Screen>
      {/* ترويسة الترحيب */}
      <AppText weight="bold" style={{ fontSize: 26, color: colors.ink }}>
        أهلاً بكِ في فل كير 🌸
      </AppText>
      <AppText style={{ fontSize: 15, color: colors.muted, marginTop: 6 }}>
        رفيقتكِ اليومية للعناية والجمال
      </AppText>

      {/* بطاقة التقدّم والنقاط */}
      <View style={{ marginTop: 20 }}>
        <ProgressCard />
      </View>

      {/* بطاقة حبسة العروس */}
      <View
        style={{
          marginTop: 24,
          backgroundColor: colors.primary,
          borderRadius: 24,
          padding: 22,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="flame" size={26} color={colors.white} />
          <AppText weight="bold" style={{ fontSize: 20, color: colors.white, marginRight: 8 }}>
            حَبْسَة العروس
          </AppText>
        </View>
        <AppText style={{ fontSize: 14, color: colors.white, marginTop: 8, lineHeight: 24 }}>
          رحلة التجهيز السودانية الكاملة قبل العرس — مراحل واضحة تأخذكِ بيدكِ خطوة بخطوة.
        </AppText>
      </View>

      {/* بطاقات سريعة */}
      <AppText weight="bold" style={{ fontSize: 18, color: colors.ink, marginTop: 28 }}>
        ابدئي يومكِ
      </AppText>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
        <QuickCard icon="sparkles" label="أنظمة العناية" />
        <QuickCard icon="water" label="عاداتي اليومية" />
        <QuickCard icon="trophy" label="نقاطي" />
        <QuickCard icon="heart" label="المفضلة" />
      </View>
    </Screen>
  );
}

function QuickCard({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View
      style={{
        width: "47%",
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 18,
        alignItems: "center",
        gap: 10,
      }}
    >
      <Ionicons name={icon} size={28} color={colors.accent} />
      <AppText weight="semibold" style={{ fontSize: 14, color: colors.ink, textAlign: "center" }}>
        {label}
      </AppText>
    </View>
  );
}
