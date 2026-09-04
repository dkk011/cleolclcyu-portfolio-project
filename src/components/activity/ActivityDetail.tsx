import type { Activity } from '../../types/activity.types';
import styles from './activity.module.css';

interface ActivityDetailProps {
  activity: Activity;
}

export default function ActivityDetail({
  activity,
}: ActivityDetailProps) {
  const formattedDate = activity.date
    .slice(0, 7)
    .replace('-', '.');

  return (
    <article className={styles.detail}>
      <span className={styles.detailCategory}>
        {activity.category}
      </span>

      <h3 className={styles.detailTitle}>
        {activity.detail_title ??
          activity.title}
      </h3>

      <p className={styles.detailDate}>
        {formattedDate}
      </p>

      <div className={styles.detailContent}>
        {activity.detail_content ??
          activity.description}
      </div>
    </article>
  );
}