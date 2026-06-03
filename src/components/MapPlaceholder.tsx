import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { images } from '../constants/images';
import { colors } from '../constants/theme';

export function MapPlaceholder() {
  return (
    <View style={styles.wrap}>
      <Image source={{ uri: images.villageRoad }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={styles.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.primaryLight },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(46,125,50,0.2)' },
});
