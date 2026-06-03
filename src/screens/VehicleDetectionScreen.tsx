import { ScreenLayout, StaticMap, VehicleCard, SectionTitle } from '../components';
import { vehicles } from '../data';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { VehiclesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<VehiclesStackParamList, 'VehicleDetection'>;

export function VehicleDetectionScreen({ navigation }: Props) {
  const nearby = vehicles.filter((v) => v.status !== 'offline').slice(0, 3);

  return (
    <ScreenLayout>
      <StaticMap title="Live Vehicle Tracking" gpsActive />
      <SectionTitle title="Nearby Vehicles" subtitle="Real-time detection using GPS preview (mock data)" />
      {nearby.map((v, i) => (
        <VehicleCard key={v.id} vehicle={v} index={i} />
      ))}
    </ScreenLayout>
  );
}
