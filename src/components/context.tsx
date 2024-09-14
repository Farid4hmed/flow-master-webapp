'use client';
import React, { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state'; // Import the new library

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
  deleteProject: (projectId: string, userId: string) => void;
  closeEditOption: (projectId: string) => void;
  handleOpenEditOption: (projectId: string) => void;
  handleSaveProjectTitle: (projectId: string, userId: string, newTitle: string) => void;
  changeCurrentProject: (project: CurrentProject) => void;
  fetchProjectsByUserId: (userId: number) => void;
}>({
  prompts: [],
  projects: [],
  currentProject: null,
  addPrompt: () => {},
  updatePrompt: () => {},
  removePrompt: () => {},
  addProject: () => {},
  deleteProject: () => {},
  closeEditOption: () => {},
  handleOpenEditOption: () => {},
  handleSaveProjectTitle: () => {},
  changeCurrentProject: () => {},
  fetchProjectsByUserId: () => {},
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useLocalStorageState for local storage management
  const [prompts, setPrompts] = useLocalStorageState<Prompt[]>('prompts', { defaultValue: [] });
  const [projects, setProjects] = useLocalStorageState<Project[]>('projects', { defaultValue: [] });
  const [currentProject, setCurrentProject] = useLocalStorageState<CurrentProject | null>('currentProject', { defaultValue: null });

  // Synchronize prompts with currentProject.prompts whenever currentProject changes
  useEffect(() => {
    if (currentProject) {
      setPrompts(currentProject.prompts);
    }
  }, [currentProject?.id]);

  // Use effect to update projects whenever the prompts state changes
  useEffect(() => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject?.id
          ? { ...project, prompts: prompts } // Update prompts for the matching project
          : project
      )
    );


  }, [prompts]);

  // Function to add a new prompt
  const addPrompt = (prompt: Prompt) => {
    setPrompts((prevPrompts) => [...prevPrompts, prompt]);
  };

  // Function to update an existing prompt
  const updatePrompt = (id: string, updatedPrompt: Partial<Prompt>) => {
    setPrompts((prevPrompts) => {
      const updatedPrompts = prevPrompts.map((prompt) =>
        prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
      );
      saveUpdatedPrompts(updatedPrompts);
      return updatedPrompts;
    });
  };

  // Function to save the updated prompts to the database
  const saveUpdatedPrompts = async (latestPrompts: Prompt[]) => {
    try {
      if (currentProject) {
        const response = await fetch('/api/projects/savePrompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: currentProject.id,
            prompts: latestPrompts,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update the prompts in the database');
        }

        const result = await response.json();
        const updatedProject = result.project;
        console.log('Updated project:', updatedProject);
      } else {
        console.log('No Project Selected');
      }
    } catch (error) {
      console.error('Error updating prompts in the database:', error);
    }
  };

  // Function to remove a prompt
  const removePrompt = (id: string) => {
    setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id));
  };

  // Function to add a new project
  const addProject = async (project: Project) => {
    try {
    //   const tempProject: Project = {
    //     id: project.title,
    //     userId: project.userId,
    //     title: project.title,
    //     prompts: project.prompts,
    //     mermaid: project.mermaid,
    //     edit: false,
    //   };
    //   setProjects((prevProjects) => [tempProject, ...prevProjects]);

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
        const newProject: Project = data.project;
        changeCurrentProject(newProject);
        setProjects((prevProjects) => [newProject, ...prevProjects]);
        // updateProjectId(newProject);
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

  const handleOpenEditOption = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, edit: true } : project
      )
    );
  };

  const handleSaveProjectTitle = async (projectId: string, userId: string, newTitle: string) => {
    const trimmedTitle = newTitle.length > 22 ? newTitle.slice(0, 22) + '...' : newTitle;
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, title: trimmedTitle, edit: false } : project
      )
    );

    try {
      const response = await fetch('/api/projects/renameProjectTitle', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, userId, newTitle: trimmedTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating project title:', errorData.error);
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId ? { ...project, title: project.title, edit: true } : project
          )
        );
      }
    } catch (error) {
      console.error('Error updating project title:', error);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, title: project.title, edit: true } : project
        )
      );
    }

    closeEditOption(projectId);
  };

  const deleteProject = async (projectId: string, userId: string) => {
    setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
    
)   
    try {
      const response = await fetch('/api/projects/deleteProject', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, userId }),
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
      } else {
        const errorData = await response.json();
        console.error('Error deleting project:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const closeEditOption = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, edit: false } : project
      )
    );
  };

  const changeCurrentProject = (project: CurrentProject) => {
    setCurrentProject(project);
  };

  const fetchProjectsByUserId = async (userId: number) => {
    try {
      const response = await fetch(`/api/projects/getAllProjects`, {
        method: 'GET',
        body: JSON.stringify({
          userId: userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
        if (data.projects.length > 0) {
          changeCurrentProject(data.projects[0]);
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
        fetchProjectsByUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};