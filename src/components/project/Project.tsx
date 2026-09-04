import { useEffect, useState } from 'react';
import { getProjects } from '../../api/project/getProjects';
import type { Project as ProjectType } from '../../types/project.types';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import styles from './project.module.css';

export default function Project() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectType | null>(null);

  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error('Project 불러오기 실패:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="project"
      className={styles.project}
    >
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>PROJECTS</p>

          <h2 className={styles.title}>프로젝트</h2>
        </header>

        <div className={styles.projectList}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
}