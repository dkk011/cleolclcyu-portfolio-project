import { useEffect, useState } from 'react';
import { getProjects } from '../../api/project/getProjects';
import type { Project as ProjectType } from '../../types/project.types';
import ProjectCard from './ProjectCard';
import ProjectDetailModal from './ProjectDetailModal';
import styles from './project.module.css';

export default function Project() {
  // 프로젝트 목록 저장
  const [projects, setProjects] = useState<ProjectType[]>([]);

  // 선택된 프로젝트 저장
  const [selectedProject, setSelectedProject] =
    useState<ProjectType | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Supabase에서 데이터 가져오기
    getProjects()
      .then((data) => {
        // 컴포넌트가 아직 화면에 있을 때만 상태 변경
        if (isMounted) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error('Project 불러오기 실패:', error);
      });

    // 컴포넌트가 unmount 되면 이후에 상태 변경 안 함
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
              // 카드 클릭하면 해당 프로젝트를 선택 상태로 저장
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* 선택된 프로젝트가 있을 때만 상세 모달 보여주기, null이면 렌더링 안 함 */}
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