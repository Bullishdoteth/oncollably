import { create } from "zustand"

export interface UserProfile {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  handle?: string | null
  workspaceType?: string | null
}

interface UserState {
  user: UserProfile | null
  isHydrated: boolean
  
  // Actions
  setUser: (user: UserProfile | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isHydrated: false,

  setUser: (user) => set({ user, isHydrated: true }),
  clearUser: () => set({ user: null, isHydrated: true }),
}))
