import { useCallback, useEffect, useRef, useState } from 'react';
import { getSkills } from '../../api/skill/getSkills';
import type { Skill as SkillType, SkillCategory } from '../../types/skill.types';
import styles from './skill.module.css';

const categories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Data',
  'Tools',
];

export default function Skill() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [currentCategory, setCurrentCategory] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const categoryTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    getSkills()
      .then((data) => {
        if (isMounted) {
          setSkills(data);
        }
      })
      .catch((error) => {
        console.error('Skill 불러오기 실패:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 실제 카테고리 트랙의 가로 길이에 맞춰 섹션의 전체 스크롤 높이를 동적 할당
  const updateSectionHeight = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const categoryTrack = categoryTrackRef.current;

    if (!section || !track || !categoryTrack) return;

    const maxScrollDistance = categoryTrack.scrollWidth - track.clientWidth;
    // 전체 세로 스크롤 높이 = 뷰포트 높이(100vh) + 가로로 밀어야 하는 총 거리
    section.style.height = `${window.innerHeight + Math.max(0, maxScrollDistance)}px`;
  }, []);

  const syncScroll = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const categoryTrack = categoryTrackRef.current;

    if (!section || !track || !categoryTrack || skills.length === 0) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const maxHorizontalScroll = categoryTrack.scrollWidth - track.clientWidth;

    if (maxHorizontalScroll <= 0) return;

    // 섹션 상단이 화면 상단에 닿는 순간(sticky 활성화)부터 가로 스크롤 개시
    const scrolledY = -rect.top;
    const progress = Math.min(Math.max(scrolledY / maxHorizontalScroll, 0), 1);

    // 하드웨어 가속 기반 translate
    categoryTrack.style.transform = `translateX(-${progress * maxHorizontalScroll}px)`;

    const categoryIndex = Math.min(
      Math.floor(progress * categories.length),
      categories.length - 1
    );

    setCurrentCategory(categoryIndex);
  }, [skills.length]);

  useEffect(() => {
    updateSectionHeight();
    syncScroll();

    window.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateSectionHeight();
      syncScroll();
    });

    const resizeObserver = new ResizeObserver(() => {
      updateSectionHeight();
      syncScroll();
    });

    if (categoryTrackRef.current) {
      resizeObserver.observe(categoryTrackRef.current);
    }

    return () => {
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
      resizeObserver.disconnect();
    };
  }, [updateSectionHeight, syncScroll]);

  return (
    <section ref={sectionRef} id="skill" className={styles.skill}>
      <div className={styles.sticky}>
        <div className={styles.container}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>SKILLS</p>
            <h2 className={styles.title}>기술 스택</h2>
          </header>

          <div ref={trackRef} className={styles.track}>
            <div ref={categoryTrackRef} className={styles.categoryTrack}>
              {categories.map((category, categoryIndex) => {
                const categorySkills = skills
                  .filter((skill) => skill.category === category)
                  .sort((a, b) => a.sort_order - b.sort_order);

                if (categorySkills.length === 0) {
                  return null;
                }

                return (
                  <section
                    key={category}
                    className={`${styles.category} ${
                      categoryIndex === currentCategory ? styles.categoryActive : ''
                    }`}
                  >
                    <h3 className={styles.categoryTitle}>
                      {category.toUpperCase()}
                    </h3>

                    <div className={styles.skillList}>
                      {categorySkills.map((skill) => (
                        <article key={skill.id} className={styles.skillItem}>
                          <div className={styles.skillHeader}>
                            <div className={styles.skillIcon}>{skill.icon}</div>
                            <h4 className={styles.skillName}>{skill.name}</h4>
                          </div>

                          <p className={styles.description}>
                            {skill.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className={styles.guide} aria-hidden="true">
            <span className={styles.guideText}>SCROLL TO EXPLORE</span>
            <span className={styles.guideArrow}>→</span>
          </div>
        </div>
      </div>
    </section>
  );
}