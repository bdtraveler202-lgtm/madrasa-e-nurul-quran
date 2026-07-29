/* ===========================================
   MADRASA ERP
   LOGIN.JS
=========================================== */

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const remember = document.getElementById("remember");
const togglePassword = document.getElementById("togglePassword");

/* ===========================================
   SHOW / HIDE PASSWORD
=========================================== */

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

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

    const oldText = btn.innerHTML;

    btn.disabled = true;

    btn.innerHTML = "Signing In...";

    const { data, error } = await supabase.auth.signInWithPassword({

        email: email.value.trim(),

        password: password.value

    });

    btn.disabled = false;

    btn.innerHTML = oldText;

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

});

/* ===========================================
   AUTO SESSION CHECK
=========================================== */

(async () => {

    const {

        data: {

            session

        }

    } = await supabase.auth.getSession();

    if (session) {

        window.location.href = "admin.html";

    }

})();
