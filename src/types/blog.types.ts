export interface Blog {
    id: number;

    title: string;
    description: string | null;

    source: string;
    date: string;
    
    url: string;
    
    sort_order: number;
}