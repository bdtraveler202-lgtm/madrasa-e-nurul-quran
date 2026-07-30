/* ===========================================
   SUPABASE CONFIG
=========================================== */

const SUPABASE_URL = "https://sbuwokmghcqjpjxcuywa.supabase.co";
const SUPABASE_ANON_KEY = "তোমার_Anon_Public_Key";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
