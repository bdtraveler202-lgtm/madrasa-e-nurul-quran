const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const { error } = await window.supabaseClient.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        alert("❌ ভুল Email অথবা Password");

        return;

    }

    alert("✅ Login সফল হয়েছে");

    window.location.href = "admin.html";

});
