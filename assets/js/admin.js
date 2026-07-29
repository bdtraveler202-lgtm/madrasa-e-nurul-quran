/* ===========================================
   MADRASA ERP
   ADMIN.JS
=========================================== */

/* ==========================
   SESSION CHECK
========================== */

async function checkSession() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {

        window.location.href = "login.html";
        return;

    }

    document.getElementById("adminName").textContent =
        session.user.email;

}

/* ==========================
   LOGOUT
========================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        const ok = confirm("Are you sure you want to logout?");

        if (!ok) return;

        await supabase.auth.signOut();

        window.location.href = "login.html";

    });

}

/* ==========================
   DASHBOARD COUNTS
========================== */

async function loadDashboardCards() {

    const students = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

    const teachers = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true });

    const employees = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true });

    document.getElementById("cardStudents").textContent =
        students.count || 0;

    document.getElementById("cardTeachers").textContent =
        teachers.count || 0;

    document.getElementById("cardEmployees").textContent =
        employees.count || 0;

}

/* ==========================
   TODAY COLLECTION
========================== */

async function loadTodayCollection() {

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase

        .from("fees")

        .select("amount")

        .eq("payment_date", today);

    let total = 0;

    if (data) {

        data.forEach(item => {

            total += Number(item.amount || 0);

        });

    }

    document.getElementById("todayCollection").textContent =
        "৳ " + total.toLocaleString();

}

/* ==========================
   RECENT NOTICE
========================== */

async function loadRecentNotices() {

    const box = document.getElementById("recentNoticeList");

    const { data } = await supabase

        .from("notices")

        .select("*")

        .order("notice_date", { ascending: false })

        .limit(5);

    if (!data) return;

    box.innerHTML = "";

    data.forEach(item => {

        box.innerHTML += `

<div class="notice-item">

<h6>${item.title}</h6>

<small>${item.notice_date ?? ""}</small>

</div>

`;

    });

}

/* ==========================
   FINANCE CHART
========================== */

function financeChart() {

    const ctx = document
        .getElementById("financeChart");

    if (!ctx) return;

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun"
            ],

            datasets: [

                {

                    label: "Income",

                    data: [0, 0, 0, 0, 0, 0]

                },

                {

                    label: "Expense",

                    data: [0, 0, 0, 0, 0, 0]

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

/* ==========================
   GLOBAL SEARCH
========================== */

const search = document.getElementById("globalSearch");

if (search) {

    search.addEventListener("keypress", e => {

        if (e.key !== "Enter") return;

        const id = search.value.trim();

        if (!id) return;

        window.location.href =
            "student-profile.html?id=" +
            encodeURIComponent(id);

    });

}

/* ==========================
   INIT
========================== */

async function initDashboard() {

    await checkSession();

    await loadDashboardCards();

    await loadTodayCollection();

    await loadRecentNotices();

    financeChart();

}

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
