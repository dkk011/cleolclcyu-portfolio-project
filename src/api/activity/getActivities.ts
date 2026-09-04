import { supabase } from '../supabase';
import type { Activity } from '../../types/activity.types';

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