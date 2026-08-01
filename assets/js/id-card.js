/* ==========================================
   Madrasa-E Nurul Quran
   ID CARD
========================================== */

const db = window.supabaseClient;

/* ==========================
   SESSION
========================== */

async function checkSession() {

    const { data: { session } } = await db.auth.getSession();

    if (!session) {

        location.href = "login.html";
        return false;

    }

    return true;

}

/* ==========================
   LOAD STUDENT
========================== */

async function loadStudent() {

    const studentID = new URLSearchParams(location.search).get("id");

    if (!studentID) {

        alert("Student ID Missing");
        return;

    }

    const { data, error } = await db

        .from("students")

        .select("*")

        .eq("student_id", studentID)

        .single();

    if (error || !data) {

        alert("Student Not Found");
        return;

    }

    document.getElementById("photo").src =
        data.photo_url || "assets/img/default-user.png";

    document.getElementById("studentID").textContent =
        data.student_id || "-";

    document.getElementById("studentName").textContent =
        data.student_name_bn ||
        data.student_name_en ||
        "-";

    document.getElementById("department").textContent =
        data.department || "-";

    document.getElementById("studentClass").textContent =
        data.class_name || "-";

    document.getElementById("roll").textContent =
        data.roll || "-";

    document.getElementById("session").textContent =
        data.session || "-";

    document.getElementById("mobile").textContent =
        data.guardian_mobile ||
        data.father_mobile ||
        "-";

    const qrText =
        location.origin +
        "/student-profile.html?id=" +
        encodeURIComponent(data.student_id);

    document.getElementById("qrCode").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(qrText);

}

/* ==========================
   PRINT
========================== */

function printCard() {

    window.print();

}

/* ==========================
   INIT
========================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

    await loadStudent();

});
