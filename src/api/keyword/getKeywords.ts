import { supabase } from '../supabase';
import type { Keyword } from '../../types/keyword.types';

export async function getKeywords(): Promise<Keyword[]> {
    const { data, error } = await supabase
        .from('keywords')
        .select('keyword, question, answer')
        .order('id');

    if (error) {
        throw new Error(error.message);
    }

    return data ?? [];
}