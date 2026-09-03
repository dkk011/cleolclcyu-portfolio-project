import type { Project } from '../../entities/project/model/types';

interface ProjectDetailModalProps {
    project: Project;
    onClose: () => void;
}

export default function ProjectDetailModal({
    project,
    onClose,
}: ProjectDetailModalProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
        >
            <div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="프로젝트 상세 닫기"
                >
                    닫기
                </button>

                <header>
                    <h2 id="project-modal-title">
                        {project.title}
                    </h2>

                    <div>
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>
                        )}

                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Live
                            </a>
                        )}
                    </div>
                </header>

                <section>
                    <h3>기술 스택</h3>

                    <div>
                        {project.tech_stack.map((tech) => (
                            <span key={tech}>{tech}</span>
                        ))}
                    </div>
                </section>

                <section>
                    <h3>프로젝트 정보</h3>

                    <dl>
                        <div>
                            <dt>역할</dt>
                            <dd>{project.role}</dd>
                        </div>

                        <div>
                            <dt>참여 인원</dt>
                            <dd>{project.member_count}명</dd>
                        </div>

                        <div>
                            <dt>프로젝트 기간</dt>
                            <dd>{project.period}</dd>
                        </div>
                    </dl>
                </section>

                <section>
                    <h3>프로젝트 소개</h3>
                    <p>{project.description}</p>
                </section>

                {project.image_urls.length > 0 && (
                    <section>
                        <h3>프로젝트 이미지</h3>

                        <div>
                            {project.image_urls.map((imageUrl, index) => (
                                <img
                                    key={imageUrl}
                                    src={imageUrl}
                                    alt={`${project.title} 이미지 ${index + 1}`}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h3>프로젝트 상세</h3>
                    <p>{project.detail}</p>
                </section>
            </div>
        </div>
    );
}