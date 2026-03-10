import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wuuxjzmpvklyehfddrpy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dXhqem1wdmtseWVoZmRkcnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Mjk1MzQsImV4cCI6MjA4NDIwNTUzNH0.HPmHoLVwsY_nLiHkcm2hlg0f_Lvmpc7LZvQN7DFLJEE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
