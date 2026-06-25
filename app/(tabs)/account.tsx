import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { ProgressCard } from '@/components/gamification/ProgressCard';
import { BadgesGrid } from '@/components/gamification/BadgesGrid';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { useAuth } from '@/lib/auth/AuthContext';

const rows: { icon: keyof typeof Ionicons.glyphMap; label: string; href: Href }[] = [
  { icon: 'heart', label: 'المفضلة', href: '/favorites' },
  { icon: 'notifications', label: 'التنبيهات', href: '/notifications' },
  { icon: 'shield-checkmark', label: 'الخصوصية والشروط', href: '/privacy' },
  { icon: 'information-circle', label: 'عن التطبيق', href: '/about' },
];

export default function AccountScreen() {
  const { user, displayName, signOut } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: user ? colors.accent : colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={user ? 'person-circle' : 'person'}
            size={42}
            color={user ? colors.white : colors.primaryDark}
          />
        </View>
        <AppText weight="bold" style={{ fontSize: 20, color: colors.ink, marginTop: 12 }}>
          {user ? displayName : 'ضيفة'}
        </AppText>
        {user ? (
          <AppText style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            {user.email}
          </AppText>
        ) : (
          <Pressable onPress={() => setShowAuth(true)}>
            <AppText style={{ fontSize: 13, color: colors.primary, marginTop: 4 }}>
              سجّلي الدخول لحفظ تقدّمكِ
            </AppText>
          </Pressable>
        )}
      </View>

      {!user && (
        <View style={{ marginTop: 16 }}>
          <Button label="تسجيل الدخول" onPress={() => setShowAuth(true)} />
        </View>
      )}

      <View style={{ marginTop: 22 }}>
        <ProgressCard />
      </View>

      <View style={{ marginTop: 24 }}>
        <BadgesGrid />
      </View>

      <View style={{ marginTop: 24, gap: 10 }}>
        {rows.map((row) => (
          <Pressable
            key={row.label}
            onPress={() => router.push(row.href)}
            style={({ pressed }) => ({
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name={row.icon} size={22} color={colors.accent} />
            <AppText
              weight="semibold"
              style={{ fontSize: 15, color: colors.ink, marginRight: 14, flex: 1 }}
            >
              {row.label}
            </AppText>
            <Ionicons name="chevron-back" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      {user && (
        <Button
          label="تسجيل الخروج"
          variant="outline"
          onPress={signOut}
          style={{ marginTop: 20 }}
        />
      )}

      <Modal visible={showAuth} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.cream }}>
          <AuthScreen onClose={() => setShowAuth(false)} />
        </View>
      </Modal>
    </Screen>
  );
}
