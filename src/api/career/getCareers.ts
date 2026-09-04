import { supabase } from '../supabase';
import type { Career } from '../../types/career.types';

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