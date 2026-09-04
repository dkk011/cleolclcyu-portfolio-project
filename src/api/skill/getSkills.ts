import { supabase } from '../supabase';
import type { Skill } from '../../types/skill.types';

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