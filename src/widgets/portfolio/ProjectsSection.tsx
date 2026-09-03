import { projects } from '../../entities/project/model/data';

import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  return (
    <section id="projects">
      <header>
        <p>PROJECTS</p>
        <h2>프로젝트</h2>
      </header>

      <div>
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
          />
        ))}
      </div>
    </section>
  );
}