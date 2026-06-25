import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { TaskChecklist } from '@/components/TaskChecklist';
import { colors } from '@/theme/colors';
import { getSystemById } from '@/data/systems';
import { POINTS_PER_TASK } from '@/lib/gamification/gamificationEngine';
import { useFavorites } from '@/lib/favorites/FavoritesContext';

export default function SystemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const system = getSystemById(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!system) {
    return (
      <Screen>
        <AppText style={{ fontSize: 16, color: colors.ink }}>النظام غير موجود.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* ترويسة مع زر رجوع */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.ink} />
        </Pressable>
        <AppText style={{ fontSize: 30 }}>{system.icon}</AppText>
        <AppText weight="bold" style={{ fontSize: 22, color: colors.ink, flex: 1 }}>
          {system.nameAr}
        </AppText>
        {/* زر المفضلة */}
        <Pressable
          onPress={() => toggleFavorite(system.id)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={isFavorite(system.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <AppText style={{ fontSize: 14, color: colors.muted, lineHeight: 26 }}>
        {system.introAr}
      </AppText>

      {/* المسار المزدوج */}
      {system.trackMode === 'dual' && system.tracks && (
        <View style={{ marginTop: 18, gap: 12 }}>
          <TrackCard
            title="🟤 المسار السوداني التراثي"
            items={system.tracks.sudaneseAr}
            bg={colors.primaryLight}
          />
          <TrackCard
            title="🌍 المسار العالمي الحديث"
            items={system.tracks.internationalAr}
            bg={colors.accentLight}
          />
        </View>
      )}

      {/* هوية سودانية خالصة */}
      {system.trackMode === 'sudanese_only' && system.pureSudaneseAr && (
        <View style={{ marginTop: 18 }}>
          <TrackCard
            title="🟤 هوية سودانية خالصة"
            items={system.pureSudaneseAr}
            bg={colors.primaryLight}
          />
        </View>
      )}

      {/* محاور المحتوى */}
      <AppText weight="bold" style={{ fontSize: 17, color: colors.ink, marginTop: 24 }}>
        المحاور
      </AppText>
      <View style={{ marginTop: 10, gap: 8 }}>
        {system.sectionsAr.map((section, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              backgroundColor: colors.white,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <Ionicons name="bookmark" size={18} color={colors.accent} />
            <AppText style={{ flex: 1, fontSize: 14, color: colors.ink, lineHeight: 24 }}>
              {section}
            </AppText>
          </View>
        ))}
      </View>

      {/* مهام اليوم */}
      <AppText weight="bold" style={{ fontSize: 17, color: colors.ink, marginTop: 24 }}>
        مهام اليوم{' '}
        <AppText style={{ fontSize: 12, color: colors.accent }}>
          (+{POINTS_PER_TASK} لكل مهمة)
        </AppText>
      </AppText>
      <View style={{ marginTop: 10 }}>
        <TaskChecklist
          items={system.dailyTasksAr.map((label, i) => ({
            id: `system:${system.id}:${i}`,
            label,
          }))}
        />
      </View>

      {/* تنبيه السلامة */}
      {system.safetyAr && (
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            gap: 8,
            backgroundColor: '#FEF6E7',
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Ionicons name="shield-checkmark" size={18} color={colors.accentDark} />
          <AppText style={{ flex: 1, fontSize: 12.5, color: colors.ink, lineHeight: 22 }}>
            {system.safetyAr}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

function TrackCard({ title, items, bg }: { title: string; items: string[]; bg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 18, padding: 16 }}>
      <AppText weight="bold" style={{ fontSize: 15, color: colors.ink }}>
        {title}
      </AppText>
      <View style={{ marginTop: 10, gap: 6 }}>
        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <Ionicons name="ellipse" size={7} color={colors.ink} style={{ marginTop: 8 }} />
            <AppText style={{ flex: 1, fontSize: 13.5, color: colors.ink, lineHeight: 24 }}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
