/* ===========================================
   MADRASA ERP
   ID CARD
=========================================== */

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

    const id = new URLSearchParams(location.search).get("id");

    if (!id) {

        alert("Student ID Missing");
        return;

    }

    const { data, error } = await db

        .from("students")

        .select("*")

        .eq("id", id)

        .single();

    if (error || !data) {

        alert("Student Not Found");
        return;

    }

    document.getElementById("photo").src =
        data.photo || "assets/img/default-user.png";

    document.getElementById("studentID").textContent =
        data.id || "-";

    document.getElementById("studentName").textContent =
        data.name || "-";

    document.getElementById("studentClass").textContent =
        data.class || "-";

    document.getElementById("roll").textContent =
        data.roll || "-";

    document.getElementById("department").textContent =
        data.department || "-";

    document.getElementById("session").textContent =
        data.session || "-";

    document.getElementById("mobile").textContent =
        data.mobile || "-";

    document.getElementById("bloodGroup").textContent =
        data.blood_group || "-";

    const qrText =
        location.origin +
        "/student-profile.html?id=" +
        data.id;

    QRCode.toDataURL(qrText, function (err, url) {

        if (!err) {

            document.getElementById("qrCode").src = url;

        }

    });

}

/* ==========================
INIT
========================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

    await loadStudent();

});
