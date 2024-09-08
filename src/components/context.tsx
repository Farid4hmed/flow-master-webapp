'use client'
import React from 'react'

export const AppContext = React.createContext({
    isAdmin : false,
    toggleIsAdmin: (isAdmin: boolean) => {}
})

export const AppProvider = ({ children }: any) => {
    const [isAdmin, setIsAdmin] = React.useState(false)

    const toggleIsAdmin = (isAdmin: boolean) => {
        setIsAdmin((prev) => isAdmin)
    }
    return (
        <AppContext.Provider value={{ isAdmin, toggleIsAdmin }}>
            {children}
        </AppContext.Provider>
    )
}