import { useState } from 'react';

import { activities } from '../../entities/activity/model/data';
import type { ActivityCategory } from '../../entities/activity/model/types';
import ActivityItem from './ActivityItem';

const categories: Array<'전체' | ActivityCategory> = [
  '전체',
  '대외활동',
  '해커톤',
  '공모전',
  '대회',
  '스터디',
  '밋업',
];

export default function ActivitiesSection() {
  const [selectedCategory, setSelectedCategory] = useState<'전체' | ActivityCategory>('전체');

  const filteredActivities =
    selectedCategory === '전체' ? activities : activities.filter(
      (activity) => activity.category === selectedCategory
    );

  return (
    <section id="activities">
      <header>
        <p>ACTIVITY</p>

        <h2>함께 배우고 도전한 순간들</h2>
      </header>

      <nav aria-label="활동 카테고리">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setSelectedCategory(category)
            }
            aria-pressed={
              selectedCategory === category
            }
          >
            {category}
          </button>
        ))}
      </nav>

      <div>
        {filteredActivities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
          />
        ))}
      </div>
    </section>
  );
}