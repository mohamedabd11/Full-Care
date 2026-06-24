import { useState } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { useAuth } from '@/lib/auth/AuthContext';

type Mode = 'login' | 'register';

export function AuthScreen({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');

  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length >= 6 &&
    (mode === 'login' || name.trim().length > 0);

  async function handleSubmit() {
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      if (mode === 'register') {
        const result = await signUp(email.trim(), password, name.trim());
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('تم التسجيل بنجاح! تحققي من بريدك الإلكتروني لتأكيد الحساب.');
        }
      } else {
        const result = await signIn(email.trim(), password);
        if (result.error) {
          setError(result.error);
        } else {
          onClose();
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <AppText weight="bold" style={{ fontSize: 26, color: colors.ink, textAlign: 'center' }}>
          {mode === 'login' ? 'تسجيل الدخول' : 'حساب جديد'}
        </AppText>
        <AppText style={{ fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8 }}>
          {mode === 'login'
            ? 'سجّلي الدخول لحفظ تقدّمكِ في السحابة'
            : 'أنشئي حساباً لحفظ تقدّمكِ ومزامنته'}
        </AppText>

        <View style={{ marginTop: 28, gap: 14 }}>
          {mode === 'register' && (
            <TextInput
              placeholder="اسمكِ"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              style={inputStyle}
              placeholderTextColor={colors.muted}
            />
          )}
          <TextInput
            placeholder="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={inputStyle}
            placeholderTextColor={colors.muted}
          />
          <TextInput
            placeholder="كلمة المرور (6 أحرف على الأقل)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={inputStyle}
            placeholderTextColor={colors.muted}
          />
        </View>

        {error ? (
          <AppText style={{ color: '#D32F2F', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
            {error}
          </AppText>
        ) : null}

        {success ? (
          <AppText style={{ color: '#2E7D32', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
            {success}
          </AppText>
        ) : null}

        <View style={{ marginTop: 20 }}>
          {busy ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Button
              label={mode === 'login' ? 'دخول' : 'تسجيل'}
              onPress={handleSubmit}
              disabled={!canSubmit}
            />
          )}
        </View>

        <Button
          label={mode === 'login' ? 'ليس لديكِ حساب؟ سجّلي الآن' : 'لديكِ حساب؟ سجّلي الدخول'}
          variant="ghost"
          onPress={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
            setSuccess('');
          }}
          style={{ marginTop: 10 }}
        />

        <Button
          label="متابعة كضيفة"
          variant="ghost"
          onPress={onClose}
          style={{ marginTop: 4 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  backgroundColor: colors.white,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.border,
  paddingVertical: 14,
  paddingHorizontal: 16,
  fontSize: 15,
  color: colors.ink,
  fontFamily: 'Cairo_400Regular',
  textAlign: 'right' as const,
  writingDirection: 'rtl' as const,
};
