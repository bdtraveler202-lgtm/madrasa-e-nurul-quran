// =======================================
// SUPABASE CONFIG
// =======================================

const SUPABASE_URL = "sbuwokmghcqjpjxcuywa";

const SUPABASE_ANON_KEY = "sb_publishable_zWUKFexK6Mv6FO6dTfeDBg_ExYrCkd_";

window.supabaseClient = supabase.createClient(

SUPABASE_URL,

SUPABASE_ANON_KEY,

{

auth:{

persistSession:true,

autoRefreshToken:true,

detectSessionInUrl:true

}

}

);

// =======================================
// SESSION CHECK
// =======================================

async function getCurrentUser(){

const { data } = await window.supabaseClient.auth.getUser();

return data.user;

}

// =======================================
// LOGOUT
// =======================================

async function logout(){

await window.supabaseClient.auth.signOut();

window.location.href="login.html";

}
