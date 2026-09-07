export type SkillCategory =
    | 'Frontend'
    | 'Backend'
    | 'Mobile'
    | 'Language'
    | 'Cloud / API'
    | 'Embedded / IoT'
    | 'Data'
    | 'Tools';

export interface Skill {
    id: number;
    category: SkillCategory;
    name: string;
    icon: string;
    description: string;
    sort_order: number;
    created_at?: string | null;
}