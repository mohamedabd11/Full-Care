import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { useGamification } from '@/lib/gamification/GamificationContext';

export function BadgesGrid() {
  const { badges } = useGamification();
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText weight="bold" style={{ fontSize: 18, color: colors.ink }}>
          الشارات
        </AppText>
        <AppText style={{ fontSize: 13, color: colors.muted }}>
          {unlockedCount} من {badges.length}
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
        {badges.map(({ def, unlocked }) => (
          <View
            key={def.id}
            style={{
              width: '47%',
              backgroundColor: colors.white,
              borderRadius: 18,
              padding: 16,
              alignItems: 'center',
              gap: 6,
              opacity: unlocked ? 1 : 0.45,
            }}
          >
            <AppText style={{ fontSize: 34 }}>{unlocked ? def.emoji : '🔒'}</AppText>
            <AppText weight="semibold" style={{ fontSize: 14, color: colors.ink, textAlign: 'center' }}>
              {def.nameAr}
            </AppText>
            <AppText style={{ fontSize: 11.5, color: colors.muted, textAlign: 'center', lineHeight: 18 }}>
              {def.descAr}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
