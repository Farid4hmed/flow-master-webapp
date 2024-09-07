"use client"
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AppWrapper from "@/app/excalidraw/appWrapper";
import { signOut } from "next-auth/react"
import Logout from "./logout";

export function SidebarWrapper({ children, ...props }: any) {

  const { session } = props;

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    }
    // ,
    // {
    //   label: "Logout",
    //   href: "#",
    //   icon: (
    //     <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];

  const logoutLink = {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 text-center dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  async function handleLogout() {
    await signOut()
  }

  const loginLink = {
    label: "Login",
    href: "/login",
    icon: (
      <img src="/login.png" className="text-neutral-700 text-center dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    ),
  };
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            {/* <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div> */}
          </div>
          <div>
            <div className={`mt-auto p-4 ${!open ? 'flex justify-center items-center' : ''}`}>
              {!!session ? (
                <div
                  onClick={handleLogout}
                  className={`flex items-center w-full p-2 cursor-pointer rounded-md ${open ? 'justify-start' : 'justify-center'
                    }`}
                >
                  <IconArrowLeft className="text-neutral-700 text-center dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                  {open && <span>Logout</span>}
                </div>
              ) : (
                <SidebarLink link={loginLink} />
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="/blueprint.png" className="h-6 w-7 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Solutions Mapper
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="/blueprint.png" className="h-6 w-7 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <section className="w-auto h-full flex flex-row">
      <AppWrapper />
    </section>
  );
};
