"use client";
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
import { signOut } from "next-auth/react";
import Logout from "./logout";
import { Button } from "./ui/button";

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
    },
  ];

  const logoutLink = {
    label: "Logout",
    href: "#",
    icon: (
      <IconArrowLeft className="text-neutral-700 text-center dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  };

  async function handleLogout() {
    await signOut();
  }

  const loginLink = {
    label: "Sign In",
    href: "/login",
    icon: (
      <img
        src="/login.png"
        className="text-neutral-700 text-center dark:text-neutral-200 h-6 w-6 flex-shrink-0"
      />
    ),
  };

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen w-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <hr className="mt-2"></hr>
            {/* Projects Section */}
            {open &&
              <div className="pt-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  {!!session && projects.length > 0 &&
                    <button
                      type="button"
                      className="text-black border border-black hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-black dark:text-black dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      <span className="sr-only">Add a Project</span>
                    </button>
                  }
                </div>
                <div
                  className="max-h-[60%] overflow-y-auto border border-gray-200 rounded-md p-2"
                  style={{ height: "60vh" }}
                >
                  {!!session ? (

                    projects.length ?
                      projects.map((project, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-gray-100 rounded-md">
                          {project}
                        </div>
                      ))
                      :
                      <div className="flex items-center text-sm justify-center h-full text-center text-gray-500">
                        <span>
                          <Link href="#" className="text-blue-500 underline">
                            Add
                          </Link>{" "}
                          a new project
                        </span>
                      </div>

                  ) : (
                    <div className="flex items-center text-sm justify-center h-full text-center text-gray-500">
                      <span>
                        <Link href="/login" className="text-blue-500 underline">
                          SignIn / SignUp
                        </Link>{" "}
                        to access projects
                      </span>
                    </div>
                  )}
                </div>
              </div>
            }
          </div>

          <div>
            <div
              className={`mt-auto p-4 ${!open ? "flex justify-center items-center" : ""
                }`}
            >
              {!!session ? (
                <div
                  onClick={handleLogout}
                  className={`flex items-center w-full p-2 cursor-pointer rounded-md ${open ? "justify-start" : "justify-center"
                    }`}
                >
                  <IconArrowLeft className="text-neutral-700 text-center text-sm dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                  {open && <span>Sign Out</span>}
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
      <img
        src="/blueprint.png"
        className="h-6 w-7 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
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
      <img
        src="/blueprint.png"
        className="h-6 w-7 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
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