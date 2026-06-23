import { Pressable, PressableProps, View } from 'react-native';
import { AppText } from './AppText';
import { colors } from '@/theme/colors';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  disabled?: boolean;
};

export function Button({ label, variant = 'primary', disabled, style, ...props }: Props) {
  const bg =
    variant === 'primary' ? colors.primary : variant === 'outline' ? colors.white : 'transparent';
  const textColor = variant === 'primary' ? colors.white : colors.primaryDark;
  const border = variant === 'outline' ? colors.primary : 'transparent';

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={(state) => [
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      <View>
        <AppText weight="bold" style={{ color: textColor, fontSize: 16, textAlign: 'center' }}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}
