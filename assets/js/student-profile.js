/* ==========================================
   Student Profile
   Madrasa-E Nurul Quran
========================================== */

const params = new URLSearchParams(window.location.search);
const studentID = params.get("id");

/* ==========================
   LOAD PROFILE
========================== */

async function loadProfile() {

    if (!studentID) {

        alert("Student ID not found.");

        return;

    }

    const { data, error } = await supabase

        .from("students")

        .select("*")

        .eq("student_id", studentID)

        .single();

    if (error) {

        alert(error.message);

        return;

    }

    /* Basic */

    document.getElementById("profilePhoto").src =
        data.photo_url || "assets/img/default-user.png";

    document.getElementById("studentName").textContent =
        data.student_name_bn || data.student_name_en || "";

    document.getElementById("studentID").textContent =
        data.student_id;

    document.getElementById("department").textContent =
        data.department || "";

    document.getElementById("studentClass").textContent =
        data.class_name || "";

    document.getElementById("roll").textContent =
        data.roll || "";

    document.getElementById("section").textContent =
        data.section || "";

    document.getElementById("session").textContent =
        data.session || "";

    document.getElementById("status").textContent =
        data.status || "";

    document.getElementById("dob").textContent =
        data.dob || "";

    document.getElementById("bloodGroup").textContent =
        data.blood_group || "";

    /* Parents */

    document.getElementById("fatherName").textContent =
        data.father_name || "";

    document.getElementById("fatherMobile").textContent =
        data.father_mobile || "";

    document.getElementById("fatherOccupation").textContent =
        data.father_occupation || "";

    document.getElementById("motherName").textContent =
        data.mother_name || "";

    document.getElementById("motherMobile").textContent =
        data.mother_mobile || "";

    document.getElementById("motherOccupation").textContent =
        data.mother_occupation || "";

    /* Guardian */

    document.getElementById("guardianName").textContent =
        data.guardian_name || "";

    document.getElementById("guardianRelation").textContent =
        data.guardian_relation || "";

    document.getElementById("guardianMobile").textContent =
        data.guardian_mobile || "";

    document.getElementById("emergencyContact").textContent =
        data.emergency_contact || "";

    /* Address */

    document.getElementById("presentAddress").textContent =
        data.present_address || "";

    document.getElementById("permanentAddress").textContent =
        data.permanent_address || "";

    document.getElementById("village").textContent =
        data.village || "";

    document.getElementById("postOffice").textContent =
        data.post_office || "";

    document.getElementById("upazila").textContent =
        data.upazila || "";

    document.getElementById("district").textContent =
        data.district || "";

    /* QR */

    document.getElementById("qrCode").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
        encodeURIComponent(data.student_id);

}

/* ==========================
   PRINT
========================== */

function printIDCard() {

    window.open(
        "id-card.html?id=" +
        encodeURIComponent(studentID),
        "_blank"
    );

}

function printAdmitCard() {

    window.open(
        "admit-card.html?id=" +
        encodeURIComponent(studentID),
        "_blank"
    );

}

/* ==========================
   START
========================== */

document.addEventListener(
    "DOMContentLoaded",
    loadProfile
);
