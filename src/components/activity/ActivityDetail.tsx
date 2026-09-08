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
        {/* 상세 제목이 있으면 detail_title 사용하고 없으면 기본 활동 제목 사용 */}
        {activity.detail_title ??
          activity.title}
      </h3>

      <p className={styles.detailDate}>
        {formattedDate}
      </p>

      <div className={styles.detailContent}>
        {/* 상세 제목이 있으면 detail_content 사용하고 없으면 기본 활동 내용 사용 */}
        {activity.detail_content ??
          activity.description}
      </div>
    </article>
  );
}