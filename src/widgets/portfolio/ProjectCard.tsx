import type { Project } from '../../entities/project/model/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <div>
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} 프로젝트`}
          />
        ) : (
          <div>
            <span>project media</span>
            <span>1200×800</span>
          </div>
        )}
      </div>

      <div>
        <header>
          <div>
            <h3>{project.title}</h3>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                Live
              </a>
            )}
          </div>

          <p>
            {project.role} · {project.memberCount}인 ·{' '}
            {project.period}
          </p>
        </header>

        <p>{project.description}</p>

        <ul>
          {project.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <p>{project.detail}</p>

        <div>
          {project.readmeUrl && (
            <a
              href={project.readmeUrl}
              target="_blank"
              rel="noreferrer"
            >
              README
            </a>
          )}

          {project.retrospectiveUrl && (
            <a
              href={project.retrospectiveUrl}
              target="_blank"
              rel="noreferrer"
            >
              회고록
            </a>
          )}
        </div>
      </div>
    </article>
  );
}