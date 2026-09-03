import { supabase } from '../../../shared/api/supabase';
import type { Skill } from '../model/types';

export async function getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}