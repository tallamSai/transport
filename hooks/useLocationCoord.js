import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

/**
 * @returns {{ lat: number, lng: number, label: string, loading: boolean, error: string | null }}
 */
export function useLocationCoord() {
  const [coord, setCoord] = useState({ lat: 28.62, lng: 77.25, label: 'Default' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        setCoord({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'GPS',
        });
      } catch (e) {
        setError(e?.message || 'Location error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { ...coord, loading, error };
}
