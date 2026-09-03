import { supabase } from '../../../shared/api/supabase';
import type { Career } from '../model/types';

export async function getCareers(): Promise<Career[]> {
    const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}