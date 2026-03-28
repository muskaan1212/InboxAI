'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface EnvironmentContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined)

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [isDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const toggleDarkMode = () => {
    // Dark mode is always on for this app
  }

  return (
    <EnvironmentContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext)
  if (context === undefined) {
    throw new Error('useEnvironment must be used within EnvironmentProvider')
  }
  return context
}
