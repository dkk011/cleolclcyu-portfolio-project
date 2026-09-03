import { useEffect, useState } from 'react';

import { getProjects } from '../../entities/project/api/getProjects';
import type { Project } from '../../entities/project/model/types';

import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';

export default function ProjectsSection() {
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
    <section>
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