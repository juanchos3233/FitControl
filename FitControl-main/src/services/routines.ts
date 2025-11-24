import { collection, getDocs, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface Routine {
  id?: string;
  title: string;
  notes?: string;
  date: string;   // ISO
  minutes?: number;
  kcal?: number;
  items?: { name: string; sets?: number; reps?: number; weight?: number }[];
}

function colRoutines(uid: string) {
  return collection(db, 'users', uid, 'routines');
}
function colWorkouts(uid: string) {
  return collection(db, 'users', uid, 'workouts');
}

async function tryGet(queryRef: any) {
  const snap = await getDocs(queryRef);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Routine) }));
}

export async function getUserRoutines(uid?: string): Promise<Routine[]> {
  const u = auth.currentUser;
  const _uid = uid || u?.uid;
  if (!_uid) throw new Error('No hay sesión');

  const q1 = query(colRoutines(_uid), orderBy('date', 'desc'));
  let list = await tryGet(q1);
  if (list.length) return list;

  const q2 = query(colWorkouts(_uid), orderBy('date', 'desc'));
  list = await tryGet(q2);
  return list;
}

export function listenUserRoutines(
  cb: (routines: Routine[]) => void,
  onError?: (e: any) => void,
  uid?: string
) {
  const u = auth.currentUser;
  const _uid = uid || u?.uid;
  if (!_uid) throw new Error('No hay sesión');

  const q = query(colRoutines(_uid), orderBy('date', 'desc'));
  const unsub1 = onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as Routine) }));
    if (list.length) {
      cb(list);
    } else {
      // intenta workouts si routines está vacío
      const q2 = query(colWorkouts(_uid), orderBy('date', 'desc'));
      onSnapshot(q2, (snap2) => {
        const list2 = snap2.docs.map(d => ({ id: d.id, ...(d.data() as Routine) }));
        cb(list2);
      }, onError);
    }
  }, onError);

  return () => unsub1();
}

export async function createDummyRoutine(uid?: string) {
  const u = auth.currentUser;
  const _uid = uid || u?.uid;
  if (!_uid) throw new Error('No hay sesión');

  const now = new Date().toISOString();
  await addDoc(colRoutines(_uid), {
    title: 'Rutina demo',
    date: now,
    minutes: 25,
    kcal: 180,
    items: [{ name: 'Sentadillas', sets: 3, reps: 12 }],
  } as Routine);
}
