import { useEffect, useState } from 'react';

import { getProjects } from '../../api/project/getProjects';
import type { Project } from '../../types/project.types';

import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';

export default function Project() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Projects Error:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="project">
      <h2>PROJECTS</h2>
      <p>프로젝트</p>

      <div>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleSelectProject}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}