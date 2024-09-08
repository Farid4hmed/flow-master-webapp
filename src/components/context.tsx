'use client';
import React, { useState, useEffect } from 'react';

// Define the structure of a prompt
interface Prompt {
    id: string;
    text: string;
    response: string;
}

// Define the structure of a project
interface Project {
    id: string;
    title: string;
    userId: number;
    edit: boolean;
    prompts: Prompt[];
    mermaid: string;
}

// Define the structure of the current project
interface CurrentProject {
    title: string;
    userId: number;
    id: any;
    prompts: Prompt[];
    mermaid: string;
}

// Define the context with prompts, projects, current project, and their functions
export const AppContext = React.createContext<{
    prompts: Prompt[];
    projects: Project[];
    currentProject: CurrentProject | null;
    addPrompt: (prompt: Prompt) => void;
    updatePrompt: (id: string, updatedPrompt: Partial<Prompt>) => void;
    removePrompt: (id: string) => void;
    addProject: (project: Project) => void;
    deleteProject: (index: number) => void;
    closeEditOption: (index: number) => void;
    handleOpenEditOption: (index: number) => void;
    handleSaveProjectTitle: (index: number, newTitle: string) => void;
    changeCurrentProject: (project: CurrentProject) => void;
    fetchProjectsByUserId: (userId: number) => void;
}>({
    prompts: [],
    projects: [],
    currentProject: null,
    addPrompt: () => { },
    updatePrompt: () => { },
    removePrompt: () => { },
    addProject: () => { },
    deleteProject: () => { },
    closeEditOption: () => { },
    handleOpenEditOption: () => { },
    handleSaveProjectTitle: () => { },
    changeCurrentProject: () => { },
    fetchProjectsByUserId: () => { }
});

export const AppProvider = ({ children }: any) => {
    // State for prompts
    const [prompts, setPrompts] = useState<Prompt[]>(() => {
        const storedPrompts = localStorage.getItem('prompts');
        return storedPrompts ? JSON.parse(storedPrompts) : [];
    });

    // State for projects
    const [projects, setProjects] = useState<Project[]>(() => {
        const storedProjects = localStorage.getItem('projects');
        return storedProjects ? JSON.parse(storedProjects) : [];
    });

    // State for current project
    const [currentProject, setCurrentProject] = useState<CurrentProject | null>(() => {
        const storedCurrentProject = localStorage.getItem('currentProject');
        return storedCurrentProject ? JSON.parse(storedCurrentProject) : null;
    });

    console.log("THE CURRPROJECT", currentProject)

    // // Synchronize prompts with currentProject.prompts whenever currentProject changes
    useEffect(() => {
        if (currentProject) {
            setPrompts(currentProject.prompts);
        }
    }, [currentProject && currentProject.id]);

    // // Update currentProject.prompts whenever prompts state changes

    // Use effect to update localStorage whenever the prompts state changes
    useEffect(() => {
        // Update localStorage whenever prompts state changes
        localStorage.setItem('prompts', JSON.stringify(prompts));

        // Update the projects state with the new prompts for the matching project
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === currentProject?.id
                    ? { ...project, prompts: prompts } // Update prompts for the matching project
                    : project
            )
        );


    }, [prompts]); // Depend on prompts state

    // Use effect to update localStorage whenever the projects state changes
    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects));


    }, [projects]);

    // Use effect to update localStorage whenever the current project changes
    useEffect(() => {
        if (currentProject) {
            localStorage.setItem('currentProject', JSON.stringify(currentProject));
        }
    }, [currentProject]);

    // Function to add a new prompt
    const addPrompt = (prompt: Prompt) => {
        setPrompts((prevPrompts) => [...prevPrompts, prompt]);
    };

    // Function to update an existing prompt
    const updatePrompt = (id: string, updatedPrompt: Partial<Prompt>) => {
        setPrompts((prevPrompts) =>
            prevPrompts.map((prompt) =>
                prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
            )
        );
    };

    // Function to remove a prompt
    const removePrompt = (id: string) => {
        setPrompts((prevPrompts) =>
            prevPrompts.filter((prompt) => prompt.id !== id)
        );
    };

    // Function to add a new project
    const addProject = async (project: Project) => {
        try {
            const tempProject = {
                id: project.title,
                userId: project.userId,
                title: project.title,
                prompts: project.prompts,
                mermaid: project.mermaid,
            };
            setProjects((prevProjects: any) => [tempProject, ...prevProjects]);

            const response = await fetch('/api/projects/addProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: project.userId,
                    title: project.title,
                    prompts: project.prompts,
                    mermaid: project.mermaid,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newProject = data.project;
                changeCurrentProject(newProject);
                updateProjectId(newProject);
            } else {
                console.error('Failed to add project:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const updateProjectId = (project: Project) => {
        setProjects((prevProjects) =>
            prevProjects.map((item) =>
                item.title === project.title ? { ...item, id: project.id } : item
            )
        );
    };

    // Function to open edit mode for a project
    const handleOpenEditOption = (index: number) => {
        setProjects((prevProjects) =>
            prevProjects.map((project, idx) =>
                idx === index ? { ...project, edit: true } : project
            )
        );
    };

    // Function to save the project title
    const handleSaveProjectTitle = (index: number, newTitle: string) => {
        const trimmedTitle = newTitle.length > 22 ? newTitle.slice(0, 22) + '...' : newTitle;
        setProjects((prevProjects) =>
            prevProjects.map((project, idx) =>
                idx === index ? { ...project, title: trimmedTitle, edit: false } : project
            )
        );
        closeEditOption(index);
    };

    // Function to delete a project
    const deleteProject = (index: number) => {
        setProjects((prevProjects) =>
            prevProjects.filter((_, idx) => idx !== index)
        );
    };

    // Function to close the edit option for a project
    const closeEditOption = (index: number) => {
        setProjects((prevProjects) =>
            prevProjects.map((project, idx) =>
                idx === index ? { ...project, edit: false } : project
            )
        );
    };

    // Function to change the current project
    const changeCurrentProject = (project: CurrentProject) => {
        setCurrentProject(project);
    };

    const fetchProjectsByUserId = async (userId: number) => {
        try {
            const response = await fetch(`/api/projects/getAllProjects?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProjects(data.projects);
                if (data.projects.length > 0) {
                    changeCurrentProject(data.projects[0])
                }
            } else {
                console.error('Failed to fetch projects:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    return (
        <AppContext.Provider
            value={{
                prompts,
                projects,
                currentProject,
                addPrompt,
                updatePrompt,
                removePrompt,
                addProject,
                deleteProject,
                closeEditOption,
                handleOpenEditOption,
                handleSaveProjectTitle,
                changeCurrentProject,
                fetchProjectsByUserId
            }}
        >
            {children}
        </AppContext.Provider>
    );
};