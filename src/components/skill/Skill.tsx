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

// DB에 저장된 icon 문자열과 react-icons에서 사용할 아이콘 컴포넌트 연결
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

// 기술별 브랜드 색상
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

// DB icon 문자열에 해당하는 아이콘 컴포넌트 가져오기
function getSkillIcon(icon: string) {
  return skillIcons[icon.toLowerCase()] ?? null;
}

// DB icon 문자열에 해당하는 브랜드 색상 가져오기
function getSkillIconColor(icon: string) {
  return skillIconColors[icon.toLowerCase()] ?? '#20242a';
}

export default function Skill() {
  // Supabase에서 가져온 기술 스택 목록
  const [skills, setSkills] = useState<SkillType[]>([]);

  // 현재 화면에서 활성화된 카테고리
  const [currentCategory, setCurrentCategory] = useState(0);

  // Skill 전체 영역
  const sectionRef = useRef<HTMLElement | null>(null);

  // 화면에 보여지는 영역
  const trackRef = useRef<HTMLDivElement | null>(null);

  // 좌우로 이동할 카테고리 영역
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

  // 가로로 이동할 거리만큼 Skill 섹션 세로 높이 설정
  // 세로 스크롤 공간이 충분해야 아래로 스크롤하면서 가로 이동 가능
  const updateSectionHeight = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const categoryTrack = categoryTrackRef.current;

    if (!section || !track || !categoryTrack) {
      return;
    }

    // 전체 Skill 콘텐츠에서 화면에 보이는 영역을 뺀 값
    const maxScrollDistance = categoryTrack.scrollWidth - track.clientWidth;

    section.style.height = `${window.innerHeight + Math.max(0, maxScrollDistance)}px`;
  }, []);

  // 현재 페이지의 세로 스크롤 위치를 가로 이동 위치로 바꾸기
  const syncScroll = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const categoryTrack = categoryTrackRef.current;

    if (!section || !track || !categoryTrack || skills.length === 0) {
      return;
    }

    // 현재 Skill 영역이 화면에서 어느 위치에 있는지 확인
    const rect = section.getBoundingClientRect();

    // Skill 콘텐츠가 이동할 수 있는 최대 가로 거리
    const maxHorizontalScroll = categoryTrack.scrollWidth - track.clientWidth;

    if (maxHorizontalScroll <= 0) {
      return;
    }

    // 섹션의 top 위치를 이용해서 세로 스크롤 진행률 계산
    const scrolledY = -rect.top;    // 얼마나 내려왔는지
    const progress = Math.min(Math.max(scrolledY / maxHorizontalScroll, 0), 1);   // 전체 가로 이동 거리 중 얼마나 진행했는지 (범위는 0부터 1)

    // 세로 스크롤 진행률을 가로 이동 거리로 바꾸기
    // progress가 0.5면 maxHorizontalScroll의 절반만큼 왼쪽으로 이동
    categoryTrack.style.transform = `translateX(-${progress * maxHorizontalScroll}px)`;

    // 전체 진행률을 Skill index로 바꾸기 -> 나중에 Skill 강조할 떄 사용
    const categoryIndex = Math.min(
      Math.floor(progress * categories.length),
      categories.length - 1,
    );

    setCurrentCategory(categoryIndex);
  }, [skills.length]);

  useEffect(() => {
    // 처음 렌더링될 때 현재 크기와 스크롤 위치 맞추기
    updateSectionHeight();
    syncScroll();

    const handleScroll = () => {
      // 페이지 스크롤할 때마다 가로 위치 다시 계산
      syncScroll();
    };

    const handleResize = () => {
      // 화면 크기 바뀌면 이동 거리 다시 계산
      updateSectionHeight();
      syncScroll();
    };

    // 세로 스크롤 감지해서 가로 이동 처리
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Skill 콘텐츠 자체 크기가 변경되는 경우 감지
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

          {/* track은 화면에 실제로 보여지는 영역 */}
          <div ref={trackRef} className={styles.track}>
            {/* categoryTrack은 가로로 이동하는 요소 */}
            <div ref={categoryTrackRef} className={styles.categoryTrack}>
              {categories.map((category, categoryIndex) => {
                // 현재 카테고리에 해당하는 Skill만 필터링
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
                      // 현재 카테고리면 categoryActive 클래스 추가
                      categoryIndex === currentCategory ? styles.categoryActive : ''
                    }`}
                  >
                    <h3 className={styles.categoryTitle}>{category.toUpperCase()}</h3>

                    <div className={styles.skillList}>
                      {categorySkills.map((skill) => {
                        // DB icon 값에 맞는 아이콘 컴포넌트 가져오기
                        const Icon = getSkillIcon(skill.icon);

                        return (
                          <article key={skill.id} className={styles.skillItem}>
                            <div className={styles.skillHeader}>
                              <div className={styles.skillIcon}>
                                {/* 아이콘이 있으면 React Icons 렌더링하고
                                없으면 DB에 저장된 문자열의 앞 두 글자로 표시 */}
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