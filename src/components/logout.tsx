"use client"
import { signOut } from "next-auth/react"

export default function Logout() {
    async function handleLogout() {
        await signOut()
    }

    return (
        <span
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={handleLogout}
        >
            Sign Out
        </span>
    )
}