import type { KeyboardEvent, MouseEvent } from 'react';
import { SiGithub } from 'react-icons/si';
import { ExternalLink } from 'lucide-react';
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

  // 프로젝트 이미지가 여러 개 있으면 첫 번째 이미지를 썸네일로 사용하고 없으면 null
  const thumbnail = project.image_urls?.[0] ?? null;

  // 키보드로도 Enter나 Space를 눌러서 같은 동작 할 수 있도록
  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      // Space 눌렀을 때 페이지 같이 스크롤되는 것 방지
      event.preventDefault();
      onClick();
    }
  };

  // 카드 안에 있는 외부 링크 클릭했을 때 카드 onClick이 같이 실행되지 않도록
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
        {/* 프로젝트 이미지가 있을 때만 img 렌더링하고 없으면 빈 썸네일 보여주기 */}
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
            {/* url이 있으면 바로가기 아이콘 렌더링하고 없으면 렌더링 안 함 */}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                aria-label="프로젝트 바로가기"
                onClick={handleLinkClick}
              >
                <ExternalLink size={16} />
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
                <SiGithub size={16} />
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