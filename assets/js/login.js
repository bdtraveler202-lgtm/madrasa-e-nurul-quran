/* ===========================================
   MADRASA-E NURUL QURAN
   LOGIN.JS
=========================================== */

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const remember = document.getElementById("remember");
const togglePassword = document.getElementById("togglePassword");

/* ===========================================
   CHECK SUPABASE
=========================================== */

if (!window.supabaseClient) {
    alert("Supabase Client is not loaded!");
    throw new Error("Supabase Client not loaded");
}

/* ===========================================
   SHOW / HIDE PASSWORD
=========================================== */

togglePassword.addEventListener("click", () => {

    password.type =
        password.type === "password"
            ? "text"
            : "password";

    togglePassword.innerHTML =
        password.type === "password"
            ? '<i class="fa-solid fa-eye"></i>'
            : '<i class="fa-solid fa-eye-slash"></i>';

});

/* ===========================================
   LOAD REMEMBERED EMAIL
=========================================== */

const savedEmail = localStorage.getItem("remember_email");

if (savedEmail) {

    email.value = savedEmail;
    remember.checked = true;

}

/* ===========================================
   LOGIN
=========================================== */

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const btn = loginForm.querySelector("button");

    btn.disabled = true;
    btn.innerHTML = "Signing In...";

    try {

        const { error } =
           await window.supabaseClient.auth.signInWithPassword({
                email: email.value.trim(),

                password: password.value

            });

        if (error) {

            alert(error.message);

            return;

        }

        if (remember.checked) {

            localStorage.setItem(
                "remember_email",
                email.value.trim()
            );

        } else {

            localStorage.removeItem("remember_email");

        }

        window.location.href = "admin.html";

    } catch (err) {

        console.error(err);

        alert(err.message);

    } finally {

        btn.disabled = false;
        btn.innerHTML = "Login";

    }

});

/* ===========================================
   AUTO LOGIN
=========================================== */

(async () => {

    try {

        const { data } =
            await window.supabaseClient.auth.getSession();

        if (data.session) {

            window.location.href = "admin.html";

        }

    } catch (err) {

        console.error(err);

    }

})();
