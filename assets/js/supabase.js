/* ===========================================
   SUPABASE CONFIG
=========================================== */

const SUPABASE_URL = "https://sbuwokmghcqjpjxcuywa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_zWUKFexK6Mv6FO6dTfeDBg_ExYrCkd_";

// Global client
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
