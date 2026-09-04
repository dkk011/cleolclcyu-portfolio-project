import { supabase } from '../supabase';
import type { Blog } from '../../types/blog.types';

export async function getBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}