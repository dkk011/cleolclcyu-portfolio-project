export type SkillCategory =
    | 'Frontend'
    | 'Backend'
    | 'Data'
    | 'Tools';

export interface Skill {
    id: number;
    category: SkillCategory;
    name: string;
    icon: string;
    description: string;
    sort_order: number;
}