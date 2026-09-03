import type { Activity } from '../../entities/activity/model/types';

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({
  activity,
}: ActivityItemProps) {
  return (
    <article>
      <span aria-hidden="true" />

      <div>
        <div>
          <span>{activity.category}</span>
          <h3>{activity.title}</h3>
        </div>

        <p>{activity.description}</p>
      </div>

      <time dateTime={activity.date}>
        {activity.date.replace('-', '.')}
      </time>
    </article>
  );
}