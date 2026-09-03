import type { Activity } from '../../entities/activity/model/types';

interface ActivityDetailProps {
  activity: Activity | null;
}

export default function ActivityDetail({
  activity,
}: ActivityDetailProps) {
  if (!activity) {
    return (
      <aside>
        <p>활동을 선택해주세요.</p>
      </aside>
    );
  }

  return (
    <aside>
      <h3>
        {activity.detail_title ?? activity.title}
      </h3>

      <p>
        {activity.detail_content ?? activity.description}
      </p>
    </aside>
  );
}