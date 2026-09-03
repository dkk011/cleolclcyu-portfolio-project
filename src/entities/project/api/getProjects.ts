import { supabase } from '../../../shared/api/supabase';
import type { Project } from '../model/types';

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}