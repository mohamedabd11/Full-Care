import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";

const APP_VERSION = "1.0.0";

const principles: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  {
    icon: "sparkles",
    title: "مبادئ لا وصفات",
    body: "نعلّمكِ الأساس والمبدأ خلف كل عناية، لتختاري ما يناسب بشرتكِ وحياتكِ بثقة.",
  },
  {
    icon: "shield-checkmark",
    title: "عناية لا علاج",
    body: "كل المحتوى للجمال والعناية اليومية — تثقيفي وآمن، وليس بديلاً عن المختص.",
  },
  {
    icon: "heart",
    title: "هوية سودانية",
    body: "نحتفي بالتراث السوداني الأصيل، مع خيار المسار العالمي الحديث متى أردتِ.",
  },
];

export default function AboutScreen() {
  return (
    <Screen>
      <ScreenHeader title="عن التطبيق" icon="information-circle" />

      {/* هوية التطبيق */}
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            backgroundColor: colors.primaryLight,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 44 }}>🌸</AppText>
        </View>
        <AppText weight="bold" style={{ fontSize: 24, color: colors.ink, marginTop: 14 }}>
          فل كير
        </AppText>
        <AppText style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
          رفيقتكِ اليومية للعناية والجمال
        </AppText>
        <AppText style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
          الإصدار {APP_VERSION}
        </AppText>
      </View>

      {/* نبذة */}
      <View style={{ backgroundColor: colors.white, borderRadius: 18, padding: 18, marginTop: 24 }}>
        <AppText style={{ fontSize: 14, color: colors.ink, lineHeight: 28 }}>
          فل كير تطبيق عناية يومية وجمال للمرأة السودانية — يجمع أنظمة عناية عامة للوجه والجسم
          والشعر والتمارين والعادات، إضافةً إلى رحلة "حَبْسَة العروس" الكاملة لتجهيز العروس قبل
          عرسها خطوة بخطوة.
        </AppText>
      </View>

      {/* المبادئ */}
      <AppText weight="bold" style={{ fontSize: 17, color: colors.ink, marginTop: 24, marginBottom: 12 }}>
        فلسفتنا
      </AppText>
      <View style={{ gap: 12 }}>
        {principles.map((p) => (
          <View
            key={p.title}
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.cream,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={p.icon} size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText weight="semibold" style={{ fontSize: 15, color: colors.ink }}>
                {p.title}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 24 }}>
                {p.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <AppText style={{ fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 28 }}>
        صُنع بحب للمرأة السودانية 🌸
      </AppText>
    </Screen>
  );
}
