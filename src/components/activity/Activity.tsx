import { useEffect, useRef, useState } from 'react';

import { getActivities } from '../../api/activity/getActivities';
import type {
  Activity,
  ActivityCategory,
} from '../../types/activity.types';

import ActivityDetail from './ActivityDetail';
import ActivityItem from './ActivityItem';

const categories: Array<
  '전체' | ActivityCategory
> = [
    '전체',
    '대외활동',
    '해커톤',
    '공모전',
    '대회',
    '스터디',
    '밋업',
  ];

export default function Activity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<'전체' | ActivityCategory>('전체');

  const [activeActivity, setActiveActivity] =
    useState<Activity | null>(null);

  const activityElements =
    useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();

        setActivities(data);

        if (data.length > 0) {
          setActiveActivity(data[0]);
        }
      } catch (error) {
        console.error('Activities Error:', error);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities =
    selectedCategory === '전체'
      ? activities
      : activities.filter(
        (activity) =>
          activity.category === selectedCategory,
      );

  useEffect(() => {
    const elements = Array.from(
      activityElements.current.values(),
    );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(
                a.boundingClientRect.top -
                window.innerHeight * 0.4,
              ) -
              Math.abs(
                b.boundingClientRect.top -
                window.innerHeight * 0.4,
              ),
          );

        const target = visibleEntries[0]?.target;

        if (!target) {
          return;
        }

        const activityId = Number(
          (target as HTMLElement).dataset.activityId,
        );

        const activity = filteredActivities.find(
          (item) => item.id === activityId,
        );

        if (activity) {
          setActiveActivity(activity);
        }
      },
      {
        root: null,
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [filteredActivities]);

  const setActivityRef =
    (id: number) =>
      (element: HTMLDivElement | null) => {
        if (element) {
          activityElements.current.set(id, element);
        } else {
          activityElements.current.delete(id);
        }
      };

  const handleCategoryChange = (
    category: '전체' | ActivityCategory,
  ) => {
    setSelectedCategory(category);

    const nextActivities =
      category === '전체'
        ? activities
        : activities.filter(
          (activity) => activity.category === category,
        );

    setActiveActivity(nextActivities[0] ?? null);
  };

  return (
    <section id="activity">
      <header>
        <h2>ACTIVITY</h2>
        <p>활동</p>
      </header>

      <nav aria-label="활동 카테고리">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={selectedCategory === category}
            onClick={() =>
              handleCategoryChange(category)
            }
          >
            {category}
          </button>
        ))}
      </nav>

      <div>
        <div>
          {filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isActive={
                activeActivity?.id === activity.id
              }
              activityRef={setActivityRef(activity.id)}
            />
          ))}
        </div>

        <ActivityDetail activity={activeActivity} />
      </div>
    </section>
  );
}