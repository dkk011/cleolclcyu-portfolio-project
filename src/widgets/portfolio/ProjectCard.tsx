import type { Project } from '../../entities/project/model/types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onClick,
}: ProjectCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClick(project);
        }
      }}
    >
      {project.image_urls[0] && (
        <img
          src={project.image_urls[0]}
          alt={`${project.title} 대표 이미지`}
        />
      )}

      <div>
        <div>
          <h3>{project.title}</h3>

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`${project.title} GitHub`}
            >
              GitHub
            </a>
          )}

          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`${project.title} Live`}
            >
              Live
            </a>
          )}
        </div>

        <p>
          {project.role} · {project.member_count}명 ·{' '}
          {project.period}
        </p>

        <div>
          {project.tech_stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        <p>{project.description}</p>
      </div>
    </article>
  );
}