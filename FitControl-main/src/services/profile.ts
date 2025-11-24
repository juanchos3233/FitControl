import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase'; // ⬅️ AJUSTA si tu archivo es otro
import type { UserProfile } from '../types/models';

export async function getCurrentUID(): Promise<string> {
  const u = auth.currentUser;
  if (u?.uid) return u.uid;
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user?.uid) resolve(user.uid);
      else reject(new Error('No hay sesión'));
    });
  });
}

export async function getUserProfile(uid?: string): Promise<UserProfile | null> {
  const id = uid || (await getCurrentUID());
  const ref = doc(db, 'users', id);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveUserProfile(input: UserProfile, uid?: string) {
  const id = uid || (await getCurrentUID());
  const ref = doc(db, 'users', id);
  const data: UserProfile = { ...input, profileCompleted: true, updatedAt: new Date().toISOString() };
  await setDoc(ref, data, { merge: true });
}

export async function updateGoal(goal: UserProfile['goal'], uid?: string) {
  const id = uid || (await getCurrentUID());
  const ref = doc(db, 'users', id);
  await updateDoc(ref, { goal, updatedAt: new Date().toISOString() });
}
