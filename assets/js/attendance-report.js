/* ===========================================
   MADRASA-E NURUL QURAN
   ATTENDANCE REPORT
=========================================== */

const db = window.supabaseClient;

const reportTable = document.getElementById("reportTable");

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const reportClass = document.getElementById("reportClass");
const searchBtn = document.getElementById("searchReport");

const presentTotal = document.getElementById("presentTotal");
const absentTotal = document.getElementById("absentTotal");
const leaveTotal = document.getElementById("leaveTotal");
const attendancePercent = document.getElementById("attendancePercent");

/* ===========================================
   SESSION
=========================================== */

async function checkSession() {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (!session) {

        location.href = "login.html";
        return false;

    }

    return true;

}

/* ===========================================
   DEFAULT DATE
=========================================== */

const today = new Date().toISOString().split("T")[0];

fromDate.value = today;

toDate.value = today;
/* ===========================================
   LOAD REPORT
=========================================== */

async function loadReport() {

    reportTable.innerHTML = `
    <tr>
        <td colspan="7">Loading...</td>
    </tr>`;

    let query = db
        .from("attendance")
        .select(`
            attendance_date,
            status,
            remarks,
            students(
                id,
                name,
                class
            )
        `)
        .gte("attendance_date", fromDate.value)
        .lte("attendance_date", toDate.value)
        .order("attendance_date", {
            ascending: false
        });

    const { data, error } = await query;

    if (error) {

        console.error(error);

        return;

    }

    reportTable.innerHTML = "";

    let sl = 1;

    let present = 0;

    let absent = 0;

    let leave = 0;

    data.forEach(item => {

        if (
            reportClass.value &&
            item.students.class !== reportClass.value
        ) return;

        if (item.status === "Present") present++;

        if (item.status === "Absent") absent++;

        if (item.status === "Leave") leave++;

        reportTable.innerHTML += `
<tr>

<td>${sl++}</td>

<td>${item.students.id}</td>

<td>${item.students.name}</td>

<td>${item.students.class}</td>

<td>${item.attendance_date}</td>

<td>${item.status}</td>

<td>${item.remarks || ""}</td>

</tr>
`;

    });

    presentTotal.textContent = present;

    absentTotal.textContent = absent;

    leaveTotal.textContent = leave;

    const total = present + absent + leave;

    attendancePercent.textContent =
        total === 0
            ? "0%"
            : ((present / total) * 100).toFixed(1) + "%";

} 
/* ===========================================
   BUTTON EVENTS
=========================================== */

searchBtn.addEventListener("click", loadReport);

/* ===========================================
   EXCEL EXPORT
=========================================== */

document.getElementById("excelBtn").addEventListener("click", () => {

    alert("Excel Export Feature will be connected in the next update.");

});

/* ===========================================
   PDF EXPORT
=========================================== */

document.getElementById("pdfBtn").addEventListener("click", () => {

    window.print();

});

/* ===========================================
   LOGOUT
=========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        if (!confirm("Logout করবেন?")) return;

        await db.auth.signOut();

        location.href = "login.html";

    });

}

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

    await loadReport();

});
