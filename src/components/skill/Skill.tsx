import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  SiAndroid,
  SiCss,
  SiDart,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGooglemaps,
  SiJavascript,
  SiKakaotalk,
  SiKotlin,
  SiLinux,
  SiMqtt,
  SiMysql,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiPython,
  SiCplusplus,
  SiQt,
  SiReact,
  SiReactquery,
  SiRedux,
  SiSpotify,
  SiSupabase,
  SiTypescript,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

import { getSkills } from '../../api/skill/getSkills';

import type {
  Skill as SkillType,
  SkillCategory,
} from '../../types/skill.types';

import styles from './skill.module.css';

const categories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Mobile',
  'Language',
  'Cloud / API',
  'Embedded / IoT',
  'Tools',
];

const skillIcons: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  react: SiReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  css: SiCss,
  nodejs: SiNodedotjs,
  express: SiExpress,
  kotlin: SiKotlin,
  android: SiAndroid,
  flutter: SiFlutter,
  dart: SiDart,
  qt: SiQt,
  mysql: SiMysql,
  firebase: SiFirebase,
  supabase: SiSupabase,
  reactquery: SiReactquery,
  redux: SiRedux,
  python: SiPython,
  cpp: SiCplusplus,
  'c++': SiCplusplus,
  aws: FaAws,
  amazons3: FaAws,
  googlemaps: SiGooglemaps,
  kakao: SiKakaotalk,
  spotify: SiSpotify,
  linux: SiLinux,
  mqtt: SiMqtt,
  git: SiGit,
  github: SiGithub,
  figma: SiFigma,
};

const skillIconColors: Record<string, string> = {
  react: '#61DAFB',
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  css: '#1572B6',
  nodejs: '#5FA04E',
  express: '#000000',
  kotlin: '#7F52FF',
  android: '#3DDC84',
  flutter: '#02569B',
  dart: '#0175C2',
  qt: '#41CD52',
  mysql: '#4479A1',
  firebase: '#FFCA28',
  supabase: '#3FCF8E',
  reactquery: '#FF4154',
  redux: '#764ABC',
  python: '#3776AB',
  cpp: '#00599C',
  'c++': '#00599C',
  aws: '#FF9900',
  amazons3: '#569A31',
  googlemaps: '#4285F4',
  kakao: '#FEE500',
  spotify: '#1DB954',
  linux: '#FCC624',
  mqtt: '#660066',
  git: '#F05032',
  github: '#181717',
  figma: '#F24E1E',
};

function getSkillIcon(icon: string) {
  return skillIcons[icon.toLowerCase()] ?? null;
}

function getSkillIconColor(icon: string) {
  return skillIconColors[icon.toLowerCase()] ?? '#20242a';
}

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

  const updateSectionHeight = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const categoryTrack = categoryTrackRef.current;

    if (!section || !track || !categoryTrack) {
      return;
    }

    const maxScrollDistance = categoryTrack.scrollWidth - track.clientWidth;

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

    if (maxHorizontalScroll <= 0) {
      return;
    }

    const scrolledY = -rect.top;
    const progress = Math.min(Math.max(scrolledY / maxHorizontalScroll, 0), 1);

    categoryTrack.style.transform = `translateX(-${progress * maxHorizontalScroll}px)`;

    const categoryIndex = Math.min(
      Math.floor(progress * categories.length),
      categories.length - 1,
    );

    setCurrentCategory(categoryIndex);
  }, [skills.length]);

  useEffect(() => {
    updateSectionHeight();
    syncScroll();

    const handleScroll = () => {
      syncScroll();
    };

    const handleResize = () => {
      updateSectionHeight();
      syncScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      updateSectionHeight();
      syncScroll();
    });

    if (categoryTrackRef.current) {
      resizeObserver.observe(categoryTrackRef.current);
    }

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
                    <h3 className={styles.categoryTitle}>{category.toUpperCase()}</h3>

                    <div className={styles.skillList}>
                      {categorySkills.map((skill) => {
                        const Icon = getSkillIcon(skill.icon);

                        return (
                          <article key={skill.id} className={styles.skillItem}>
                            <div className={styles.skillHeader}>
                              <div className={styles.skillIcon}>
                                {Icon ? (
                                  <Icon
                                    size={20}
                                    aria-hidden="true"
                                    color={getSkillIconColor(skill.icon)}
                                  />
                                ) : (
                                  <span className={styles.fallbackIcon}>
                                    {skill.icon.slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>

                              <h4 className={styles.skillName}>{skill.name}</h4>
                            </div>

                            <p className={styles.description}>{skill.description}</p>
                          </article>
                        );
                      })}
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