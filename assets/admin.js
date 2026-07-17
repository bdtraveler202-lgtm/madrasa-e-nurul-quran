// ===============================
// Check Login Session
// ===============================

async function checkLogin() {

    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (!data.session) {
        window.location.href = "login.html";
        return;
    }

    loadDashboard();

}

// ===============================
// Dashboard Statistics
// ===============================

async function loadDashboard() {

    const { data, error } = await window.supabaseClient
        .from("students")
        .select("*");

    if (error) {
        console.error(error);
        alert("ডেটা লোড করা যায়নি!");
        return;
    }

    document.getElementById("totalStudents").innerText = data.length;

    document.getElementById("nurani").innerText =
        data.filter(s => s.class === "নূরানী").length;

    document.getElementById("nazera").innerText =
        data.filter(s => s.class === "নাজেরা").length;

    document.getElementById("hifz").innerText =
        data.filter(s => s.class === "হিফজ").length;

}

// ===============================
// Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await window.supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

}

// ===============================
// Start
// ===============================

checkLogin();
