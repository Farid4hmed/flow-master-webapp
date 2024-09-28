'use client';
import { getProjectTitle } from '@/app/api/chatbot';
import React, { useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';
// import mermaidToExcalidrawElements from '@/app/excalidraw/mermaidToExcali';
import { v4 as uuidv4 } from 'uuid';

interface Prompt {
  id: string;
  text: string;
  response: string;
}


interface Project {
  id: string;
  title: string;
  userId: number;
  edit: boolean;
  prompts: Prompt[];
  mermaid: string;
  elements: any;
}

interface CurrentProject {
  title: string;
  // userId: number;
  id: any;
  prompts: Prompt[];
  mermaid: string;
  elements: any;
  userId: number;
}

export const AppContext = React.createContext<{
  prompts: Prompt[];
  projects: Project[];
  currentProject: CurrentProject | null;
  changeChart: (mermaid: string, id: string) => void;
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
  clearChat: () => void;
}>({
  prompts: [],
  projects: [],
  currentProject: null,
  changeChart: () => { },
  addPrompt: () => { },
  updatePrompt: () => { },
  removePrompt: () => { },
  addProject: () => { },
  deleteProject: () => { },
  closeEditOption: () => { },
  handleOpenEditOption: () => { },
  handleSaveProjectTitle: () => { },
  changeCurrentProject: () => { },
  fetchProjectsByUserId: () => { },
  clearChat: () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [prompts, setPrompts] = useLocalStorageState<Prompt[]>('prompts', { defaultValue: [] });
  const [projects, setProjects] = useLocalStorageState<Project[]>('projects', { defaultValue: [] });
  const [currentProject, setCurrentProject] = useLocalStorageState<CurrentProject | any>('currentProject',
    {
      defaultValue: null
    });

  useEffect(() => {
    setProjects((prevProjects: any) =>
      prevProjects.map((project: any) =>
        project.id === currentProject?.id
          ? { ...project, prompts: prompts }
          : project
      )
    );


  }, [prompts]);

  const clearChat = () => {
    setPrompts([]);
  };


  const changeChart = async (mermaid: string, id: string) => {
    if (mermaid != "") {

      let ele = await convertMermaidToElements(mermaid);

      if (!currentProject) {
        setCurrentProject(
          {
            title: "temp",
            userId: "0",
            id: "0",
            prompts: [],
            mermaid: mermaid,
            elements: ele
          }
        )
      }
      else {
        setCurrentProject((prevProj: any) =>
          prevProj ? { ...prevProj, mermaid: mermaid, elements: ele } : null
        );
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id
            ? { ...project, mermaid: mermaid, elements: ele }
            : project
        )
      );



      try {
        const response = await fetch('/api/projects/saveMermaid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: id,
            mermaid: mermaid,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update mermaid:', response.statusText);
        } else {
          console.log('Mermaid data updated successfully.');
        }
      } catch (error) {
        console.error('Error updating mermaid:', error);
      }
    }
  };


  const convertMermaidToElements = async (code: any) => {
    try {
      // Dynamically import the mermaidToExcalidrawElements function
      const { default: mermaidToExcalidrawElements } = await import('@/components/excalidraw/mermaidToExcali');

      // Use the dynamically imported function
      const result: any = await mermaidToExcalidrawElements(code);
      return result;
    } catch (error) {
      console.error("Error converting Mermaid to Excalidraw elements:", error);
      return [];
    }
  };

  const addPrompt = (prompt: Prompt) => {
    setPrompts((prevPrompts) => [...prevPrompts, prompt]);
  };


  const updatePrompt = async (id: string, updatedPrompt: Partial<Prompt>) => {
    let updatedPrompts: Prompt[] = [];

    setPrompts((prevPrompts) => {
      updatedPrompts = prevPrompts.map((prompt) =>
        prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
      );

      saveUpdatedPrompts(updatedPrompts);

      return updatedPrompts;
    });

    if (updatedPrompts.length === 3 && currentProject) {
      const myUUID = uuidv4();

      const newProjectTitle = await getProjectTitle(updatedPrompts, currentProject.id, myUUID);

      handleSaveProjectTitle(currentProject.id, currentProject.userId, newProjectTitle)
      // console.log("NEWPROJECTTITLE", newProjectTitle)
      // if (newProjectTitle) {

      //   setProjects((prevProjects: any) =>
      //     prevProjects.map((project: any) =>
      //       project.id === currentProject?.id
      //         ? { ...project, title: newProjectTitle }
      //         : project
      //     )
      //   );
      // }
    }
  };


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
      } else {
        console.log('No Project Selected');
      }
    } catch (error) {
      console.error('Error updating prompts in the database:', error);
    }
  };


  const removePrompt = (id: string) => {
    setPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id));
  };


  const addProject = async (project: Project) => {
    // Generate a temporary id for the project (could be a UUID or a simple placeholder)
    const tempId = `temp-${Date.now()}`;
    const tempProject = { ...project, id: tempId };
  
    // Add the project with a temporary id to the state
    setProjects((prevProjects) => [tempProject, ...prevProjects]);
  
    try {
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
        const newProjectId: any = data.project.project_id;
  
        // Replace the temporary id with the new project_id from the API response
        const updatedProject = { ...project, id: `${newProjectId}` };
  
        // Update the project in the state with the correct id
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.id === tempId ? updatedProject : proj
          )
        );
  
        changeCurrentProject(updatedProject);
      } else {
        console.error('Failed to add project:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
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

  const changeCurrentProject = async (project: CurrentProject) => {
    if (project && (!project.elements || project.elements.length === 0)) {
      let ele = await convertMermaidToElements(project.mermaid) || [];
      // let promptsArr = JSON.parse(project
      setCurrentProject({
        ...project,
        // prompts: JSON.parse(project.prompts)
        elements: ele
      });
    }
    else setCurrentProject(project);

    if (project) {
      setPrompts(project.prompts);
    }
  };

  const fetchProjectsByUserId = async (userId: number) => {
    try {
      const response = await fetch('/api/projects/getAllProjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
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
        changeChart,
        clearChat,
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