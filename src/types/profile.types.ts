export interface Profile {
    id: number;

    role: string;
    headline: string;
    description: string;

    email: string | null;
    github_url: string | null;
    velog_url: string | null;
    linkedin_url: string | null;

    profile_image_url: string | null;

    contact_title: string;
    contact_description: string | null;
    contact_button_text: string;
    contact_button_url: string | null;
}