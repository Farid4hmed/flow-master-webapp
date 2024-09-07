"use client"
import { signOut } from "next-auth/react"
import {
    IconArrowLeft
  } from "@tabler/icons-react";

export default function Logout() {
    async function handleLogout() {
        await signOut()
    }

    return (
        <span
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={handleLogout}
        >
            <IconArrowLeft className="text-neutral-700 text-center dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            Logout
        </span>
    )
}