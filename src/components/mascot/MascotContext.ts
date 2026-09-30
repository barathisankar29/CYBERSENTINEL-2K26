import { createContext, useContext } from 'react'
import type { MascotContextType } from '@/types/mascot'

export const MascotContext = createContext<MascotContextType | null>(null)

export function useMascot(): MascotContextType {
  const ctx = useContext(MascotContext)
  if (!ctx) {
    throw new Error('useMascot must be used within a MascotProvider')
  }
  return ctx
}
