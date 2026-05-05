import { useEffect, useRef } from 'react';
import { useAgriStore } from '../store/useAgriStore';
import { subscribeDriverRequests, subscribeFarmerRequests } from '../services/transportApi';
import { scheduleLocalNotification } from '../services/localNotifications';

/** Local alerts when request status changes (works in Firebase and mock mode). */
export function useRequestNotifications() {
  const user = useAgriStore((s) => s.user);
  const firstDriver = useRef(true);
  const firstFarmer = useRef(true);
  const seenDriverIds = useRef(new Set());
  const farmerStatusById = useRef(new Map());

  useEffect(() => {
    firstDriver.current = true;
    firstFarmer.current = true;
    seenDriverIds.current.clear();
    farmerStatusById.current.clear();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return undefined;

    if (user.role === 'driver') {
      return subscribeDriverRequests(user.id, (list) => {
        const matched = list.filter((r) => r.status === 'matched');
        if (firstDriver.current) {
          firstDriver.current = false;
          matched.forEach((r) => seenDriverIds.current.add(r.id));
          const recentMs = 3 * 60 * 1000;
          for (const r of matched) {
            const t = typeof r.createdAt === 'number' ? r.createdAt : 0;
            if (t && Date.now() - t < recentMs) {
              scheduleLocalNotification(
                'New assignment',
                `${r.cropType} · ${r.quantity} kg — open Requests to accept`,
              );
            }
          }
          return;
        }
        for (const r of matched) {
          if (!seenDriverIds.current.has(r.id)) {
            seenDriverIds.current.add(r.id);
            scheduleLocalNotification(
              'New assignment',
              `${r.cropType} · ${r.quantity} kg — open Requests to accept`,
            );
          }
        }
      });
    }

    if (user.role === 'farmer') {
      return subscribeFarmerRequests(user.id, (list) => {
        if (firstFarmer.current) {
          firstFarmer.current = false;
          list.forEach((r) => farmerStatusById.current.set(r.id, r.status));
          const recentMs = 3 * 60 * 1000;
          for (const r of list) {
            if (r.status !== 'matched') continue;
            const t = typeof r.createdAt === 'number' ? r.createdAt : 0;
            if (t && Date.now() - t < recentMs) {
              scheduleLocalNotification(
                'Driver matched',
                `${r.cropType} — vehicle assigned. Waiting for driver to accept.`,
              );
            }
          }
          return;
        }
        for (const r of list) {
          const prev = farmerStatusById.current.get(r.id);
          if (prev === undefined) {
            farmerStatusById.current.set(r.id, r.status);
            if (r.status === 'matched') {
              scheduleLocalNotification(
                'Driver matched',
                `${r.cropType} — vehicle assigned. Waiting for driver to accept.`,
              );
            }
            continue;
          }
          if (prev !== r.status) {
            if (r.status === 'matched' && prev === 'pending') {
              scheduleLocalNotification(
                'Driver matched',
                'A vehicle is assigned — waiting for acceptance.',
              );
            } else if (r.status === 'accepted' && prev === 'matched') {
              scheduleLocalNotification('Trip accepted', 'The driver is on the way.');
            } else if (r.status === 'completed' && prev !== 'completed') {
              scheduleLocalNotification('Trip completed', `${r.cropType} delivered.`);
            } else if (r.status === 'cancelled' && prev === 'pending') {
              scheduleLocalNotification(
                'No vehicle available',
                'No capacity nearby — try again when drivers are online.',
              );
            }
            farmerStatusById.current.set(r.id, r.status);
          }
        }
      });
    }

    return undefined;
  }, [user?.id, user?.role]);
}
