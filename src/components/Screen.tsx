import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

// غلاف موحّد لكل الشاشات: منطقة آمنة + خلفية كريمية + حشوة جانبية
export function Screen({ children, scroll = true }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={["top"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 20 }}>{children}</View>
      )}
    </SafeAreaView>
  );
}
