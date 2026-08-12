import type { User } from '../types/auth'
const key = 'netshield-user'
export const auth = {
  get: (): User | null => { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } },
  set: (user: User) => localStorage.setItem(key, JSON.stringify(user)),
  logout: () => localStorage.removeItem(key),
}
