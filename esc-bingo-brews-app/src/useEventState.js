import { useEffect, useMemo, useState } from 'react';
import { db, doc, getDoc, setDoc, onSnapshot, serverTimestamp, hasFirebaseConfig } from './firebase';
import { defaultSettings, initialGame } from './defaultData';

const localGameKey = 'esc-bingo-game';
const localSettingsKey = 'esc-bingo-settings';

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
  catch { return fallback; }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function ensureDoc(path, fallback) {
  if (!db) return;
  const ref = doc(db, ...path);
  const snap = await getDoc(ref);
  if (!snap.exists()) await setDoc(ref, { ...fallback, updatedAt: serverTimestamp() });
}

export function useEventState() {
  const [game, setGameState] = useState(() => readLocal(localGameKey, initialGame));
  const [settings, setSettingsState] = useState(() => readLocal(localSettingsKey, defaultSettings));
  const [online, setOnline] = useState(hasFirebaseConfig);

  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      setOnline(false);
      return;
    }
    ensureDoc(['events', 'current', 'state', 'game'], initialGame);
    ensureDoc(['events', 'current', 'state', 'settings'], defaultSettings);
    const unsubGame = onSnapshot(doc(db, 'events', 'current', 'state', 'game'), (snap) => {
      if (snap.exists()) {
        setGameState(snap.data());
        writeLocal(localGameKey, snap.data());
      }
    });
    const unsubSettings = onSnapshot(doc(db, 'events', 'current', 'state', 'settings'), (snap) => {
      if (snap.exists()) {
        setSettingsState({ ...defaultSettings, ...snap.data() });
        writeLocal(localSettingsKey, { ...defaultSettings, ...snap.data() });
      }
    });
    return () => { unsubGame(); unsubSettings(); };
  }, []);

  async function setGame(next) {
    const value = typeof next === 'function' ? next(game) : next;
    setGameState(value);
    writeLocal(localGameKey, value);
    if (db) await setDoc(doc(db, 'events', 'current', 'state', 'game'), { ...value, updatedAt: serverTimestamp() }, { merge: true });
  }

  async function setSettings(next) {
    const value = typeof next === 'function' ? next(settings) : next;
    setSettingsState(value);
    writeLocal(localSettingsKey, value);
    if (db) await setDoc(doc(db, 'events', 'current', 'state', 'settings'), { ...value, updatedAt: serverTimestamp() }, { merge: true });
  }

  return useMemo(() => ({ game, settings, setGame, setSettings, online }), [game, settings, online]);
}
