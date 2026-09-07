export type ActivityCategory =
  | '수상'
  | '연구'
  | '교내활동'
  | '대외활동'
  | '어학'
  | '프로젝트'
  | '공모전'
  | '해커톤'
  | '대회'
  | '스터디'
  | '밋업';

export interface Activity {
  id: number;
  category: ActivityCategory;
  title: string;
  description: string;
  date: string;
  detail_title: string | null;
  detail_content: string | null;
  sort_order: number;
  created_at?: string | null;
}