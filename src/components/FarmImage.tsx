import { Image, type ImageStyle, type StyleProp } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

interface Props {
  uri: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  rounded?: boolean;
}

export function FarmImage({ uri, style, containerStyle, rounded = false }: Props) {
  return (
    <View style={[rounded && styles.rounded, containerStyle]}>
      <Image source={{ uri }} style={[styles.img, style]} contentFit="cover" transition={300} />
    </View>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', height: '100%', backgroundColor: colors.primaryLight },
  rounded: { overflow: 'hidden', borderRadius: radius.lg },
});
