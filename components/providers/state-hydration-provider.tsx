"use client"

import { useEffect, useRef } from "react"
import { useWorkspaceStore, type WorkspaceItem } from "@/lib/store/use-workspace-store"
import { useUserStore, type UserProfile } from "@/lib/store/use-user-store"

interface StateHydrationProviderProps {
  initialUser?: UserProfile | null
  initialActiveSpace?: string
  initialActiveHandle?: string
  initialWorkspaces?: WorkspaceItem[]
  children: React.ReactNode
}

export function StateHydrationProvider({
  initialUser,
  initialActiveSpace,
  initialActiveHandle,
  initialWorkspaces,
  children,
}: StateHydrationProviderProps) {
  const initialized = useRef(false)

  if (!initialized.current) {
    if (initialUser !== undefined) {
      useUserStore.getState().setUser(initialUser)
    }
    if (initialActiveSpace) {
      useWorkspaceStore.getState().setActiveSpace(initialActiveSpace)
    }
    if (initialActiveHandle) {
      useWorkspaceStore.getState().setActiveHandle(initialActiveHandle)
    }
    if (initialWorkspaces && initialWorkspaces.length > 0) {
      useWorkspaceStore.getState().setDbWorkspaces(initialWorkspaces)
    }
    initialized.current = true
  }

  return <>{children}</>
}
