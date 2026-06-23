import { ActivityIndicator, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { useHabsa } from '@/lib/habsa/useHabsa';
import { HabsaSetup } from '@/components/habsa/HabsaSetup';
import { HabsaDashboard } from '@/components/habsa/HabsaDashboard';

export default function HabsaScreen() {
  const { loading, config, state, setup, reset } = useHabsa();

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText weight="bold" style={{ fontSize: 24, color: colors.ink, marginBottom: 16 }}>
        حَبْسَة العروس
      </AppText>
      {config && state ? (
        <HabsaDashboard state={state} onReset={reset} />
      ) : (
        <HabsaSetup onConfirm={setup} />
      )}
    </Screen>
  );
}
