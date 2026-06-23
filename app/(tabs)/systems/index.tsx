import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { careSystems } from '@/data/systems';

const trackLabel: Record<string, string> = {
  dual: 'سوداني + عالمي',
  sudanese_only: 'سوداني خالص',
  na: '',
};

export default function SystemsIndex() {
  const router = useRouter();

  return (
    <Screen>
      <AppText weight="bold" style={{ fontSize: 24, color: colors.ink }}>
        أنظمة العناية
      </AppText>
      <AppText style={{ fontSize: 14, color: colors.muted, marginTop: 6 }}>
        ستة أنظمة مجانية — اضغطي لفتح أي نظام
      </AppText>

      <View style={{ marginTop: 20, gap: 12 }}>
        {careSystems.map((system) => (
          <Pressable
            key={system.id}
            onPress={() => router.push(`/(tabs)/systems/${system.id}`)}
            style={{
              backgroundColor: colors.white,
              borderRadius: 20,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                backgroundColor: colors.cream,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText style={{ fontSize: 26 }}>{system.icon}</AppText>
            </View>
            <View style={{ flex: 1, marginRight: 14 }}>
              <AppText weight="semibold" style={{ fontSize: 16, color: colors.ink }}>
                {system.nameAr}
              </AppText>
              {trackLabel[system.trackMode] ? (
                <AppText style={{ fontSize: 12, color: colors.accent, marginTop: 4 }}>
                  {trackLabel[system.trackMode]}
                </AppText>
              ) : null}
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
