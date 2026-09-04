import type { Activity } from '../../types/activity.types';
import styles from './activity.module.css';

interface ActivityItemProps {
  activity: Activity;
  isActive: boolean;
  activityRef: (
    element: HTMLDivElement | null,
  ) => void;
}

export default function ActivityItem({
  activity,
  isActive,
  activityRef,
}: ActivityItemProps) {
  const formattedDate = activity.date
    .slice(0, 7)
    .replace('-', '.');

  return (
    <article
      ref={activityRef}
      data-activity-id={activity.id}
      className={`${styles.item} ${
        isActive
          ? styles.itemActive
          : ''
      }`}
    >
      <time
        className={styles.date}
        dateTime={activity.date}
      >
        {formattedDate}
      </time>

      <div
        className={styles.dot}
        aria-hidden="true"
      />

      <div className={styles.itemContent}>
        <span className={styles.itemCategory}>
          {activity.category}
        </span>

        <h3 className={styles.itemTitle}>
          {activity.title}
        </h3>

        <p className={styles.itemDescription}>
          {activity.description}
        </p>
      </div>
    </article>
  );
}