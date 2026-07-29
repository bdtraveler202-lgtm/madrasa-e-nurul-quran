/* ===========================================
   SUPABASE CONFIG
=========================================== */

const SUPABASE_URL = "sbuwokmghcqjpjxcuywa";
const SUPABASE_ANON_KEY = "sb_publishable_zWUKFexK6Mv6FO6dTfeDBg_ExYrCkd_";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
