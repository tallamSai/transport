import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { FadeInView } from '../utils/animations';
import { colors, radius, shadows, spacing, typography } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  imageUri: string;
  delay?: number;
}

export function ImageStatCard({ label, value, imageUri, delay = 0 }: Props) {
  return (
    <FadeInView delay={delay} style={[styles.card, shadows.card]}>
      <Image source={{ uri: imageUri }} style={styles.thumb} contentFit="cover" />
      <View style={styles.body}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  thumb: { width: '100%', height: 72 },
  body: { padding: spacing.sm },
  value: { ...typography.h2, fontSize: 20, color: colors.primary },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
