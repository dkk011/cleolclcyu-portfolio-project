import { useCallback, useEffect, useRef, useState } from 'react';
import { getActivities } from '../../api/activity/getActivities';
import type { Activity as ActivityType } from '../../types/activity.types';
import ActivityItem from './ActivityItem';
import ActivityDetail from './ActivityDetail';
import styles from './activity.module.css';

const categories = [
  '전체',
  '대외활동',
  '해커톤',
  '공모전',
  '대회',
  '스터디',
  '밋업',
] as const;

export default function Activity() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [activeActivityId, setActiveActivityId] = useState<number | null>(null);
  const [detailOffset, setDetailOffset] = useState(0);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const activityRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const lastActiveId = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    getActivities()
      .then((data) => {
        if (!isMounted) return;

        setActivities(data);

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
    if (filteredActivities.length === 0) {
      setActiveActivityId(null);
      lastActiveId.current = null;
      return;
    }

    const firstActivity = filteredActivities[0];
    setActiveActivityId(firstActivity.id);
    lastActiveId.current = firstActivity.id;
  }, [selectedCategory]);

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
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`${styles.categoryButton} ${
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
            {activeActivity && <ActivityDetail activity={activeActivity} />}
          </div>
        </div>
      </div>
    </section>
  );
}