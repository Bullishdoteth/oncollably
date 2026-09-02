import { create } from "zustand"

export interface WorkspaceItem {
  id: string
  name: string
  handle: string
  type: string
  role?: string
}

interface WorkspaceState {
  activeSpace: string
  activeHandle: string
  dbWorkspaces: WorkspaceItem[]
  isWorkspaceMenuOpen: boolean
  isMobileOpen: boolean
  isSwitching: boolean

  // Actions
  setActiveSpace: (activeSpace: string) => void
  setActiveHandle: (activeHandle: string) => void
  setDbWorkspaces: (workspaces: WorkspaceItem[]) => void
  setIsWorkspaceMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setIsMobileOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  
  // Optimistic workspace switch action
  selectWorkspace: (workspaceType: string, handle: string) => Promise<boolean>
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeSpace: "project",
  activeHandle: "",
  dbWorkspaces: [],
  isWorkspaceMenuOpen: false,
  isMobileOpen: false,
  isSwitching: false,

  setActiveSpace: (activeSpace) => set({ activeSpace }),
  setActiveHandle: (activeHandle) => set({ activeHandle }),
  setDbWorkspaces: (dbWorkspaces) => set({ dbWorkspaces }),

  setIsWorkspaceMenuOpen: (open) =>
    set((state) => ({
      isWorkspaceMenuOpen: typeof open === "function" ? open(state.isWorkspaceMenuOpen) : open,
    })),

  setIsMobileOpen: (open) =>
    set((state) => ({
      isMobileOpen: typeof open === "function" ? open(state.isMobileOpen) : open,
    })),

  selectWorkspace: async (workspaceType: string, handle: string) => {
    const previousSpace = get().activeSpace
    const previousHandle = get().activeHandle

    // Optimistic update
    set({
      activeSpace: workspaceType,
      activeHandle: handle,
      isSwitching: true,
      isWorkspaceMenuOpen: false,
      isMobileOpen: false,
    })

    try {
      const res = await fetch("/api/workspaces/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceType, handle }),
      })

      if (!res.ok) {
        throw new Error("Failed to switch workspace")
      }

      set({ isSwitching: false })
      return true
    } catch (error) {
      console.error("[WorkspaceStore] Switch failed, reverting state:", error)
      // Rollback state on error
      set({
        activeSpace: previousSpace,
        activeHandle: previousHandle,
        isSwitching: false,
      })
      return false
    }
  },
}))
