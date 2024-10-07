"use client";
import dynamic from 'next/dynamic';
import React, { useState, useContext, useEffect } from "react";
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AppWrapper = dynamic(() => import('@/components/excalidraw/appWrapper'), {
  ssr: false, // Disable server-side rendering for this component
});
import { signOut } from "next-auth/react";
import { AppContext } from "./context";

export function SidebarWrapper({ children, ...props }: any) {
  const { session } = props;
  const {
    projects,
    addProject,
    deleteProject,
    handleOpenEditOption,
    closeEditOption,
    handleSaveProjectTitle,
    changeCurrentProject,
    currentProject,
    fetchProjectsByUserId
  } = useContext(AppContext);

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

  const Projects = {
    label: "Projects",
    href: "#",
    icon: (
      <IconBrandTabler className="text-neutral-700 text-center dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
  const [addingProj, setAddingProj] = useState(false);

  const handleAddProject = async () => {
    if (!session) {
      console.error("No session found. Please log in.");
      return;
    }
    setAddingProj(true);

    const userId = session.userId;
    const title = "Project " + (projects.length + 1);

    const newProject = { title: title, userId: userId, edit: false, id: '', mermaid: '', prompts: [], elements: [] };
    addProject(newProject);

    setAddingProj(false);
  };

  useEffect(() => {
    if (session) {
      fetchProjectsByUserId(session.userId)
    }
  }, [])


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
            {!open && <div className="pt-12"> <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" /> </div>}
            {open &&
              <div className="pt-10">
                <div className="flex justify-between items-center mb-2">
                  <SidebarLink link={Projects} />
                  {!!session && projects.length > 0 &&
                    <button
                      type="button"
                      className="text-black border border-black hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm p-1 text-center inline-flex items-center dark:border-black dark:text-black dark:hover:text-white dark:focus:ring-gray-800 dark:hover:bg-black"
                      onClick={handleAddProject}
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
                      projects.map((project: any, idx) => (
                        project.edit ?
                          <div key={idx} className="mb-2 p-2 bg-gray-100 rounded-md flex text-sm items-center justify-between hover:bg-gray-200">
                            <input
                              type="text"
                              defaultValue={project.title}
                              autoFocus
                              onBlur={(e) => handleSaveProjectTitle(project.id, session.userId, e.target.value)}
                              onKeyDown={(e: any) => {
                                if (e.key === "Enter") {
                                  handleSaveProjectTitle(project.id, session.userId, e.target.value);
                                }
                              }}
                              className="rounded p-1 border-none bg-transparent focus:outline-none focus:ring-0"
                            />
                            <div>
                              <button
                                className=" px-1 py-1 text-sm text-red-500 hover:text-red-700"
                                onClick={() => closeEditOption(project.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                              </button>
                            </div>
                          </div>
                          :
                          <div
                            key={idx}
                            className={`mb-2 p-2  rounded-md flex text-sm items-center justify-between hover:bg-gray-200 ${project.id === currentProject?.id ? "bg-gray-200" : "bg-gray-100"}`}
                            onClick={() => changeCurrentProject(project)}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                            >
                              {project.title}
                            </ReactMarkdown>

                            <div>
                              <button
                                className="ml-2 px-1 py-1 text-sm text-blue-500 hover:text-blue-700"
                                onClick={() => handleOpenEditOption(project.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-pen"><path d="M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5" /><path d="M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /></svg>
                              </button>
                              {!addingProj &&
                                <button
                                  className=" px-1 py-1 text-sm "
                                  onClick={(e) => {
                                    e.preventDefault();
                                    deleteProject(project.id, session.userId)
                                  }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-delete"><path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" /><path d="m12 9 6 6" /><path d="m18 9-6 6" /></svg>
                                </button>
                              }
                            </div>
                          </div>
                      ))
                      :
                      <div className="flex items-center text-sm justify-center h-full text-center text-gray-500">
                        <span>
                          <Link href="#" className="text-blue-500 underline" onClick={handleAddProject}>
                            Add
                          </Link>{" "}
                          a new project
                        </span>
                      </div>

                  ) : (
                    <div className="flex items-center text-sm justify-center h-full text-center text-gray-500">
                      <span>
                        <Link href="/login" className="text-blue-500 underline">
                          Sign In
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
        Flow Master
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


const Dashboard = () => {
  return (
    <section className="w-auto h-full flex flex-row">
      <AppWrapper />
    </section>
  );
};