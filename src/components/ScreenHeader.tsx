import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { colors } from "@/theme/colors";

// ترويسة موحّدة لكل الشاشات الفرعية: زر رجوع + عنوان (وأيقونة اختيارية)
export function ScreenHeader({
  title,
  icon,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* في RTL يشير سهم الرجوع لليمين */}
        <Ionicons name="chevron-forward" size={22} color={colors.ink} />
      </Pressable>
      {icon ? <Ionicons name={icon} size={26} color={colors.accent} /> : null}
      <AppText weight="bold" style={{ fontSize: 22, color: colors.ink, flex: 1 }}>
        {title}
      </AppText>
    </View>
  );
}
