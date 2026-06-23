import { Text, TextProps } from "react-native";

type Weight = "regular" | "semibold" | "bold";

const fontByWeight: Record<Weight, string> = {
  regular: "Cairo_400Regular",
  semibold: "Cairo_600SemiBold",
  bold: "Cairo_700Bold",
};

type Props = TextProps & {
  weight?: Weight;
};

// نص افتراضي بخط القاهرة ومحاذاة يمين تناسب العربية
export function AppText({ weight = "regular", style, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[
        { fontFamily: fontByWeight[weight], textAlign: "right", writingDirection: "rtl" },
        style,
      ]}
    />
  );
}
