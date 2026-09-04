import type { KeyboardEvent, MouseEvent } from 'react';
import type { Project } from '../../types/project.types';
import styles from './project.module.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({
  project,
  onClick,
}: ProjectCardProps) {
  const thumbnail = project.image_urls?.[0] ?? null;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      onClick();
    }
  };

  const handleLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    event.stopPropagation();
  };

  return (
    <article
      className={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <div className={styles.thumbnail}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${project.title} 프로젝트 이미지`}
          />
        ) : (
          <div className={styles.thumbnailEmpty} />
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            {project.title}
          </h3>

          <div className={styles.cardLinks}>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                aria-label="프로젝트 바로가기"
                onClick={handleLinkClick}
              >
                ↗
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                aria-label="GitHub 바로가기"
                onClick={handleLinkClick}
              >
                ●
              </a>
            )}
          </div>
        </div>

        <p className={styles.meta}>
          {project.role}
          {' · '}
          {project.member_count}인
          {' · '}
          {project.period}
        </p>

        <div className={styles.techStack}>
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className={styles.tech}
            >
              {tech}
            </span>
          ))}
        </div>

        <p className={styles.cardDescription}>
          {project.description}
        </p>
      </div>
    </article>
  );
}