'use client'

import { TeamWithDefault } from '@/types/dashboard'
import { User } from '@supabase/supabase-js'
import { createContext, useContext, ReactNode } from 'react'

interface ServerContextValue {
  selectedTeamId: string | null
  selectedTeamSlug: string | null
  teams: TeamWithDefault[]
  user: User
}

const ServerContext = createContext<ServerContextValue | undefined>(undefined)

interface ServerContextProviderProps {
  children: ReactNode
  teamId?: string | null
  teamSlug?: string | null
  teams: TeamWithDefault[]
  user: User
}

export function ServerContextProvider({
  children,
  teamId = null,
  teamSlug = null,
  teams,
  user,
}: ServerContextProviderProps) {
  const value = {
    selectedTeamId: teamId,
    selectedTeamSlug: teamSlug,
    teams,
    user,
  }

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  )
}

export function useServerContext() {
  const context = useContext(ServerContext)
  if (context === undefined) {
    throw new Error(
      'useServerContext must be used within a ServerContextProvider'
    )
  }
  return context
}
