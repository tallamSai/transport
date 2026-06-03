import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from './CustomButton';
import { colors, radius, spacing, typography } from '../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function SuccessModal({ visible, title, message, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <View style={styles.icon}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.msg}>{message}</Text>
          <CustomButton title="Done" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  icon: { marginBottom: spacing.md },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.sm },
  msg: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
});
