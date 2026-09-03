import { supabase } from '../../../shared/api/supabase';
import type { Activity } from '../model/types';

export async function getActivities(): Promise<Activity[]> {
    const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}