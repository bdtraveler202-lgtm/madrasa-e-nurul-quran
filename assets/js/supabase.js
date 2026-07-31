const SUPABASE_URL = "https://sbuwokmghcqjpjxcuywa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zWUKFexK6Mv6FO6dTfeDBg_ExYrCkd_";

const { createClient } = window.supabase;

window.supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
