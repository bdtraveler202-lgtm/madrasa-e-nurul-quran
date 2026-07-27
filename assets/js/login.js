// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(e){

e.preventDefault();

const email =
document.getElementById("email").value.trim();

const password =
document.getElementById("password").value;

const btn =
document.querySelector(".btn-login");

btn.disabled = true;

btn.innerHTML = "Signing In...";

const { error } =
await window.supabaseClient.auth.signInWithPassword({

email,

password

});

btn.disabled = false;

btn.innerHTML = "Login";

if(error){

alert(error.message);

return;

}

window.location.href = "admin.html";

});

// ======================================
// AUTO REDIRECT
// ======================================

(async()=>{

const { data } =
await window.supabaseClient.auth.getSession();

if(data.session){

window.location.href="admin.html";

}

})();
