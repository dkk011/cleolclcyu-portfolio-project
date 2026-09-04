export interface Project {
    id: number;
    title: string;

    github_url: string | null;
    live_url: string | null;

    tech_stack: string[];

    role: string;
    member_count: number;
    period: string;

    description: string;
    image_urls: string[];
    detail: string;
    sort_order: number;
}