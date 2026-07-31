/* ===========================================
   MADRASA-E NURUL QURAN
   ADMIN.JS
=========================================== */

const db = window.supabaseClient;

/* ===========================================
   SESSION CHECK
=========================================== */

async function checkSession() {

    try {

        const {
            data: { session }
        } = await db.auth.getSession();

        if (!session) {

            window.location.href = "login.html";
            return false;

        }

        const adminName = document.getElementById("adminName");

        if (adminName) {

            adminName.textContent = session.user.email;

        }

        return true;

    } catch (err) {

        console.error(err);

        window.location.href = "login.html";

        return false;

    }

}

/* ===========================================
   LOGOUT
=========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        if (!confirm("Logout করবেন?")) return;

        await db.auth.signOut();

        window.location.href = "login.html";

    });

} 
/* ===========================================
   DASHBOARD CARDS
=========================================== */

async function loadDashboardCards() {

    try {

        const students = await db
            .from("students")
            .select("*", { count: "exact", head: true });

        const teachers = await db
            .from("teachers")
            .select("*", { count: "exact", head: true });

        const employees = await db
            .from("employees")
            .select("*", { count: "exact", head: true });

        document.getElementById("cardStudents").textContent =
            students.count ?? 0;

        document.getElementById("cardTeachers").textContent =
            teachers.count ?? 0;

        document.getElementById("cardEmployees").textContent =
            employees.count ?? 0;

    } catch (err) {

        console.error(err);

    }

}

/* ===========================================
   TODAY COLLECTION
=========================================== */

async function loadTodayCollection() {

    try {

        const today = new Date().toISOString().split("T")[0];

        const { data } = await db
            .from("fees")
            .select("amount")
            .eq("payment_date", today);

        let total = 0;

        (data || []).forEach(item => {

            total += Number(item.amount || 0);

        });

        document.getElementById("todayCollection").textContent =
            "৳ " + total.toLocaleString();

    } catch (err) {

        console.error(err);

    }

}

/* ===========================================
   RECENT NOTICES
=========================================== */

async function loadRecentNotices() {

    try {

        const box = document.getElementById("recentNoticeList");

        if (!box) return;

        const { data } = await db
            .from("notices")
            .select("*")
            .order("notice_date", { ascending: false })
            .limit(5);

        box.innerHTML = "";

        (data || []).forEach(item => {

            box.innerHTML += `
            <div class="notice-item">
                <h6>${item.title}</h6>
                <small>${item.notice_date || ""}</small>
            </div>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}
/* ===========================================
   FINANCE CHART
=========================================== */

function financeChart() {

    const canvas = document.getElementById("financeChart");

    if (!canvas) return;

    new Chart(canvas, {

        type: "bar",

        data: {

            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

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

/* ===========================================
   GLOBAL SEARCH
=========================================== */

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

/* ===========================================
   LIVE CLOCK & DATE
=========================================== */

const todayDate = document.getElementById("todayDate");
const liveClock = document.getElementById("liveClock");
const languageSwitcher = document.getElementById("languageSwitcher");

let currentLang =
    localStorage.getItem("language") || "bn";

function updateClock() {

    const now = new Date();

    if (todayDate) {

        todayDate.textContent =
            now.toLocaleDateString(
                currentLang === "bn"
                    ? "bn-BD"
                    : "en-GB",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    }

    if (liveClock) {

        liveClock.textContent =
            now.toLocaleTimeString(
                currentLang === "bn"
                    ? "bn-BD"
                    : "en-GB"
            );

    }

}

setInterval(updateClock, 1000);

updateClock();

/* ===========================================
   LANGUAGE SWITCHER
=========================================== */

if (languageSwitcher) {

    languageSwitcher.value = currentLang;

    languageSwitcher.addEventListener("change", () => {

        currentLang = languageSwitcher.value;

        localStorage.setItem(
            "language",
            currentLang
        );

        document.querySelectorAll("[data-bn]").forEach(el => {

            el.textContent =
                currentLang === "bn"
                    ? el.dataset.bn
                    : el.dataset.en;

        });

        updateClock();

    });

}

/* ===========================================
   INIT
=========================================== */

async function initDashboard() {

    const loggedIn = await checkSession();

    if (!loggedIn) return;

    await loadDashboardCards();

    await loadTodayCollection();

    await loadRecentNotices();
    await loadNoticeTicker();
   
    financeChart();

}

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
/* ===========================================
   LIVE NOTICE TICKER
=========================================== */

async function loadNoticeTicker() {

    const ticker = document.getElementById("noticeTicker");

    if (!ticker) return;

    try {

        const { data, error } = await db
            .from("notices")
            .select("title")
            .order("notice_date", { ascending: false })
            .limit(10);

        if (error) throw error;

        if (!data || data.length === 0) {

            ticker.textContent = "কোনো নোটিশ পাওয়া যায়নি";
            return;

        }

        ticker.textContent = data
            .map(item => item.title)
            .join("  •  ");

    } catch (err) {

        console.error(err);

        ticker.textContent = "নোটিশ লোড করা যায়নি";

    }

}
