import type { Activity } from '../../types/activity.types';

interface ActivityItemProps {
  activity: Activity;
  isActive: boolean;
  activityRef: (element: HTMLDivElement | null) => void;
}

export default function ActivityItem({
  activity,
  isActive,
  activityRef,
}: ActivityItemProps) {
  return (
    <div
      ref={activityRef}
      data-activity-id={activity.id}
      aria-current={isActive ? 'step' : undefined}
    >
      <div>
        <span>{activity.category}</span>
        <time dateTime={activity.date}>
          {activity.date.slice(0, 7).replace('-', '.')}
        </time>
      </div>

      <h3>{activity.title}</h3>

      <p>{activity.description}</p>
    </div>
  );
}