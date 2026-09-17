import { AuthState, Generation, User } from './types';

const AUTH_KEY = 'forge:auth';
const GENERATIONS_KEY = 'forge:generations';

export function getAuth(): AuthState {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { isAuthenticated: false, user: null };
    return JSON.parse(raw);
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

export function setAuth(state: AuthState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function signIn(email: string, name: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    plan: 'pro',
    creditsUsed: 12,
    creditsTotal: 200,
  };
  setAuth({ isAuthenticated: true, user });
  return user;
}

export function signOut(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function getGenerations(): Generation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GENERATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGeneration(generation: Generation): void {
  if (typeof window === 'undefined') return;
  const existing = getGenerations();
  const idx = existing.findIndex(g => g.id === generation.id);
  if (idx >= 0) {
    existing[idx] = generation;
  } else {
    existing.unshift(generation);
  }
  localStorage.setItem(GENERATIONS_KEY, JSON.stringify(existing));
}

export function deleteGeneration(id: string): void {
  if (typeof window === 'undefined') return;
  const existing = getGenerations().filter(g => g.id !== id);
  localStorage.setItem(GENERATIONS_KEY, JSON.stringify(existing));
}

// Demo thumbnail pool — stable gradient placeholders keyed by ID
export function getThumbnailStyle(id: string): string {
  const gradients = [
    'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #11001c 100%)',
    'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0a1628 100%)',
    'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #260d00 100%)',
    'linear-gradient(135deg, #001a0d 0%, #003320 50%, #001a10 100%)',
    'linear-gradient(135deg, #1a001a 0%, #330033 50%, #1a001a 100%)',
    'linear-gradient(135deg, #0d0d1a 0%, #1a1a33 50%, #0a0a1a 100%)',
  ];
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}
