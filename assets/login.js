// ======================================
// LOGIN SYSTEM
// ======================================

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit", async function(e){

e.preventDefault();

const btn=document.getElementById("loginBtn");

btn.disabled=true;

btn.innerHTML="Logging...";

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

const { error } =
await window.supabaseClient.auth.signInWithPassword({

email:email,

password:password

});

if(error){

alert(error.message);

btn.disabled=false;

btn.innerHTML="Login";

return;

}

window.location.href="admin.html";

});

}
