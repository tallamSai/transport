import { MapPlaceholder } from './MapPlaceholder';

interface Props {
  markers?: unknown[];
  showRoute?: boolean;
  showUserLocation?: boolean;
}

export function FullMapView(_props: Props) {
  return <MapPlaceholder />;
}
