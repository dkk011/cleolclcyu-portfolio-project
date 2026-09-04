export type ActivityCategory = 
    | '대외활동'
    | '해커톤'
    | '공모전'
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
}