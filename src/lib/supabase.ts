import { createClient, RealtimeChannel } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jkatxcqwqcgwfscmnpsm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || 'placeholder-anon-key'
);

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase connection test warning:', error.message);
      return false;
    }
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
}

/**
 * Sets up a realtime listener for any changes (INSERT, UPDATE, DELETE) on a specified table.
 * 
 * @param tableName - The name of the table to listen to (e.g., 'messages', 'marketplace_listings')
 * @param callback - The function to execute when a change occurs.
 * @returns {RealtimeChannel} The subscription channel (use this to unsubscribe later)
 */
export function setupRealtimeSubscription(
  tableName: string,
  callback: (payload: any) => void
): RealtimeChannel {
  console.log(`Setting up realtime listener for table: ${tableName}`);

  const subscription = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        console.log(`Realtime update on ${tableName}:`, payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to realtime changes for ${tableName}`);
      }
    });

  return subscription;
}

/**
 * Initiates an OAuth Sign In flow (redirects to the provider).
 * This will hit the /auth/v1/oauth/authorize endpoint.
 * 
 * @param provider - The OAuth provider (e.g., 'github', 'google')
 */
export async function signInWithOAuth(provider: 'github' | 'google' | 'discord' | 'apple') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      // Optional: change this if you need to redirect to a specific page after login
      redirectTo: `${window.location.origin}/`
    }
  });

  if (error) {
    console.error('OAuth Sign-in Error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Signs out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign-out Error:', error.message);
  }
}
