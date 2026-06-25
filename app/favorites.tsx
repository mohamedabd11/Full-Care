import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppText } from "@/components/AppText";
import { colors } from "@/theme/colors";
import { careSystems } from "@/data/systems";
import { useFavorites } from "@/lib/favorites/FavoritesContext";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const items = careSystems.filter((s) => favorites.includes(s.id));

  return (
    <Screen>
      <ScreenHeader title="المفضلة" icon="heart" />

      {items.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 60, gap: 12 }}>
          <Ionicons name="heart-outline" size={56} color={colors.primaryLight} />
          <AppText style={{ fontSize: 15, color: colors.muted, textAlign: "center" }}>
            لا توجد عناصر في المفضلة بعد
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 24 }}>
            افتحي أي نظام عناية واضغطي على القلب لإضافته هنا
          </AppText>
          <Pressable
            onPress={() => router.push("/(tabs)/systems")}
            style={{
              marginTop: 8,
              backgroundColor: colors.primary,
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 22,
            }}
          >
            <AppText weight="bold" style={{ color: colors.white, fontSize: 14 }}>
              تصفّح الأنظمة
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {items.map((system) => (
            <Pressable
              key={system.id}
              onPress={() => router.push(`/(tabs)/systems/${system.id}`)}
              style={({ pressed }) => ({
                backgroundColor: colors.white,
                borderRadius: 20,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: colors.cream,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 26 }}>{system.icon}</AppText>
              </View>
              <AppText
                weight="semibold"
                style={{ fontSize: 16, color: colors.ink, flex: 1, marginRight: 14 }}
              >
                {system.nameAr}
              </AppText>
              <Ionicons name="heart" size={22} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
