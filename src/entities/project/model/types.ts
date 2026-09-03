export interface Project {
    title: string;
    period: string;
    role: string;
    memberCount: number;
    description: string;
    detail: string;
    techStack: string[];
    image?: string;
    githubUrl?: string;
    liveUrl?: string;
    readmeUrl?: string;
    retrospectiveUrl?: string;
}