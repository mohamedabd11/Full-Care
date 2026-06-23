import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { useGamification } from '@/lib/gamification/GamificationContext';

export function ProgressCard() {
  const { level, stats } = useGamification();

  return (
    <View style={{ backgroundColor: colors.white, borderRadius: 24, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText weight="bold" style={{ fontSize: 20, color: colors.white }}>
              {level.level}
            </AppText>
          </View>
          <View>
            <AppText weight="bold" style={{ fontSize: 17, color: colors.ink }}>
              {level.title}
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.muted }}>
              {stats.totalPoints} نقطة
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="flame" size={20} color={colors.accent} />
          <AppText weight="bold" style={{ fontSize: 16, color: colors.accentDark }}>
            {stats.currentStreak}
          </AppText>
        </View>
      </View>

      {/* شريط التقدّم للمستوى التالي */}
      <View style={{ height: 8, backgroundColor: colors.cream, borderRadius: 5, marginTop: 16, overflow: 'hidden' }}>
        <View
          style={{
            height: '100%',
            width: `${level.progressPercent}%`,
            backgroundColor: colors.accent,
            borderRadius: 5,
          }}
        />
      </View>
      <AppText style={{ fontSize: 12, color: colors.muted, marginTop: 6 }}>
        {level.pointsToNext} نقطة للمستوى التالي
      </AppText>
    </View>
  );
}
