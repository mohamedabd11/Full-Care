import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors } from '@/theme/colors';
import { useGamification } from '@/lib/gamification/GamificationContext';

export interface ChecklistItem {
  id: string;
  label: string;
}

/** قائمة مهام يومية قابلة للإنجاز — مربوطة بنظام النقاط (مهام اليوم). */
export function TaskChecklist({ items }: { items: ChecklistItem[] }) {
  const { isTaskDone, toggleTask } = useGamification();

  return (
    <View style={{ gap: 8 }}>
      {items.map((item) => {
        const done = isTaskDone(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => toggleTask(item.id)}
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
              backgroundColor: done ? colors.accentLight : colors.cream,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Ionicons
              name={done ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={done ? colors.accentDark : colors.muted}
            />
            <AppText
              style={{
                flex: 1,
                fontSize: 14,
                color: colors.ink,
                lineHeight: 24,
                textDecorationLine: done ? 'line-through' : 'none',
              }}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
