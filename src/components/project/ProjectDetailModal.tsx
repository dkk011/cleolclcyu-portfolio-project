import { useEffect } from 'react';
import type { MouseEvent } from 'react';
import { SiGithub } from 'react-icons/si';
import { ExternalLink, X } from 'lucide-react';
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
    // Modal이 열린 상태에서 ESC 키 누르면 닫기
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Modal 열려 있는 동안 ESC 키 이벤트 감지
    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    // Modal 뒤쪽 페이지가 스크롤 되지 않게 방지
    document.body.style.overflow = 'hidden';

    // Modal 닫히면 이벤트, 스크롤 제한 원래대로
    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Modal 바깥 배경 클릭하면 닫기
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
          <X size={20} />
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
              {/* url이 있으면 바로가기 아이콘 렌더링하고 없으면 렌더링 안 함 */}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.iconLink}
                  aria-label="프로젝트 바로가기"
                >
                  <ExternalLink size={18} />
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
                  <SiGithub size={18} />
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

        {/* 프로젝트 이미지가 하나 이상 있을 때만 이미지 영역 보여주기 */}
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