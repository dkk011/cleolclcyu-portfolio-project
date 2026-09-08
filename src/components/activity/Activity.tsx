import { useCallback, useEffect, useRef, useState } from 'react';
import { getActivities } from '../../api/activity/getActivities';
import type { Activity as ActivityType } from '../../types/activity.types';
import ActivityItem from './ActivityItem';
import ActivityDetail from './ActivityDetail';
import styles from './activity.module.css';

const categories = [
  '전체',
  '수상',
  '연구',
  '교내활동',
  '대외활동',
  '어학',
  '프로젝트',
  '공모전',
] as const;

export default function Activity() {
  // 전체 활동 데이터
  const [activities, setActivities] = useState<ActivityType[]>([]);

  // 현재 선택한 카테고리
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 현재 활성화된 활동 id
  const [activeActivityId, setActiveActivityId] = useState<number | null>(null);

  // 오른쪽 상세 영역 위치
  const [detailOffset, setDetailOffset] = useState(0);

  const contentRef = useRef<HTMLDivElement | null>(null);

  // 각 Activity 요소를 id로 찾아가기 위한 ref
  const activityRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // 이전에 활성화된 Activity id
  const lastActiveId = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    getActivities()
      .then((data) => {
        if (!isMounted) return;

        setActivities(data);

        // 처음 데이터를 가져왔을 때 첫 번째 활동을 활성화
        if (data.length > 0) {
          setActiveActivityId(data[0].id);
          lastActiveId.current = data[0].id;
        }
      })
      .catch((error) => {
        console.error('Activity 불러오기 실패:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 전체는 항상 표시, 나머지는 실제 데이터가 존재하는 카테고리만 화면에 표시
  const displayCategories = categories.filter(
    (cat) => cat === '전체' || activities.some((act) => act.category === cat),
  );

  // 전체를 선택하면 전체 데이터 그대로 사용, 특정 카테고리 선택하면 해당 카테고리만 filter로 가져오기
  const filteredActivities =
    selectedCategory === '전체'
      ? activities
      : activities.filter(
        (activity) => activity.category === selectedCategory,
      );

  const updateActiveActivity = useCallback(() => {
    if (filteredActivities.length === 0) return;

    const targetY = window.innerHeight * 0.42;
    let closestActivity = filteredActivities[0];
    let closestDistance = Infinity;

    // 현재 화면에서 기준 위치와 가장 가까운 활동 찾기
    filteredActivities.forEach((activity) => {
      const element = activityRefs.current[activity.id];
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - targetY);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestActivity = activity;
      }
    });

    const currentIndex = filteredActivities.findIndex(
      (activity) => activity.id === lastActiveId.current,
    );

    const nextIndex = filteredActivities.findIndex(
      (activity) => activity.id === closestActivity.id,
    );

    if (currentIndex === -1) {
      lastActiveId.current = closestActivity.id;
      setActiveActivityId(closestActivity.id);
      return;
    }

    if (currentIndex === nextIndex) return;

    const currentElement =
      activityRefs.current[filteredActivities[currentIndex].id];

    if (!currentElement) return;

    const currentRect = currentElement.getBoundingClientRect();
    const currentCenter = currentRect.top + currentRect.height / 2;
    const distanceFromTarget = Math.abs(currentCenter - targetY);
    const switchThreshold = Math.min(90, window.innerHeight * 0.08);

    if (distanceFromTarget < switchThreshold) return;

    lastActiveId.current = closestActivity.id;
    setActiveActivityId(closestActivity.id);
  }, [filteredActivities]);

  const updateDetailPosition = useCallback(() => {
    if (!activeActivityId) return;

    const activeElement = activityRefs.current[activeActivityId];
    const containerElement = contentRef.current;

    if (!activeElement || !containerElement) return;

    const activeRect = activeElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    const offset = activeRect.top - containerRect.top;
    setDetailOffset(offset);
  }, [activeActivityId]);

  useEffect(() => {
    // 카테고리를 변경하면 filteredActivities가 달라지고 이 목록의 첫 번째 활동을 다시 활성화
    if (filteredActivities.length === 0) {
      setActiveActivityId(null);
      lastActiveId.current = null;
      return;
    }

    const firstActivity = filteredActivities[0];
    setActiveActivityId(firstActivity.id);
    lastActiveId.current = firstActivity.id;
  }, [selectedCategory, filteredActivities]);

  useEffect(() => {
    const handleScroll = () => {
      updateActiveActivity();
    };

    const handleResize = () => {
      updateActiveActivity();
      updateDetailPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    requestAnimationFrame(() => {
      updateActiveActivity();
      updateDetailPosition();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateActiveActivity, updateDetailPosition]);

  useEffect(() => {
    requestAnimationFrame(updateDetailPosition);
  }, [activeActivityId, updateDetailPosition]);

  // 현재 활성화된 id와 일치하는 활동 찾기, 못 찾으면 첫 번째 활동 사용
  const activeActivity =
    filteredActivities.find(
      (activity) => activity.id === activeActivityId,
    ) ??
    filteredActivities[0] ??
    null;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <section id="activity" className={styles.activity}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>ACTIVITIES</p>
          <h2 className={styles.title}>다양한 경험</h2>
        </header>

        <div className={styles.categoryList}>
          {/* 카테고리 이름을 key로 배열을 순회하며 버튼 생성 */}
          {displayCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.categoryButton} ${
                // 현재 선택된 카테고리면 active 스타일 적용하고 아니면 빈 문자열
                selectedCategory === category
                  ? styles.categoryButtonActive
                  : ''
                }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div ref={contentRef} className={styles.content}>
          <div className={styles.timeline}>
            <div className={styles.timelineLine} aria-hidden="true" />

            {/* 필터링 된 활동 목록을 map으로 렌더링
            Activity 하나가 ActivityItem 컴포넌트로 */}
            {filteredActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isActive={activeActivityId === activity.id}
                activityRef={(element) => {
                  activityRefs.current[activity.id] = element;
                }}
              />
            ))}
          </div>

          <div
            className={styles.detailArea}
            style={{
              transform: `translateY(${detailOffset}px)`,
            }}
          >
            {/* activeActivity가 존재할 때면 상세 정보 보여주기 */}
            {activeActivity && <ActivityDetail activity={activeActivity} />}
          </div>
        </div>
      </div>
    </section>
  );
}