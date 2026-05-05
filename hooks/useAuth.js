import { useAgriStore } from '../store/useAgriStore';
import { signOutAll } from '../services/session';

export function useAuth() {
  const user = useAgriStore((s) => s.user);
  return { user, signOut: signOutAll };
}
