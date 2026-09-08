import type { Activity } from '../../types/activity.types';
import styles from './activity.module.css';

interface ActivityItemProps {
  activity: Activity;
  isActive: boolean;

  // 부모 컴포넌트에서 각 Activity DOM 요소를 저장하기 위해 사용
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
        // 현재 Activity가 활성화되면 active 스타일을 추가
        // true면 itemActive 클래스를 추가하고 false면 빈 문자열을 사용
      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
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