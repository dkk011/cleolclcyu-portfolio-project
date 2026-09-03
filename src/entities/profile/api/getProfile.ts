import { supabase } from '../../../shared/api/supabase';
import type { Profile } from '../model/types';

export async function getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}