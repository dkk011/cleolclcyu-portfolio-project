import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import type { Project } from '../../types/project.types';
import styles from './project.module.css';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleBackdropClick}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="프로젝트 상세 닫기"
        >
          ×
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <h2
              id="project-modal-title"
              className={styles.modalTitle}
            >
              {project.title}
            </h2>

            <div className={styles.modalLinks}>
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.iconLink}
                  aria-label="프로젝트 바로가기"
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
                >
                  ●
                </a>
              )}
            </div>
          </div>

          <div className={styles.modalTechStack}>
            {project.tech_stack.map((tech) => (
              <span key={tech}>
                {tech}
              </span>
            ))}
          </div>

          <p className={styles.modalMeta}>
            {project.role}
            {' · '}
            {project.member_count}인
            {' · '}
            {project.period}
          </p>

          <p className={styles.modalDescription}>
            {project.description}
          </p>
        </div>

        {project.image_urls.length > 0 && (
          <div className={styles.imageList}>
            {project.image_urls.map(
              (image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${project.title} 프로젝트 이미지 ${index + 1}`}
                />
              ),
            )}
          </div>
        )}

        <div className={styles.detail}>
          <p>{project.detail}</p>
        </div>
      </div>
    </div>
  );
}