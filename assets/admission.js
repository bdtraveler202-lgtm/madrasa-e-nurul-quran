// ======================================
// ADMISSION SYSTEM V2
// ======================================

const admissionForm = document.getElementById("admissionForm");

// ======================================
// AUTO ADMISSION DATE
// ======================================

const admissionDate = document.getElementById("admission_date");

if (admissionDate) {

    admissionDate.value =
        new Date().toISOString().split("T")[0];

}

// ======================================
// AUTO STUDENT ID
// ======================================

async function generateStudentId() {

    const { count } =
        await window.supabaseClient
        .from("students")
        .select("*", {
            count: "exact",
            head: true
        });

    const total = (count || 0) + 1;

    const studentId =
        "STU-2026-" +
        String(total).padStart(4, "0");

    document.getElementById("student_id").value =
        studentId;

}

generateStudentId();

// ======================================
// PHOTO PREVIEW
// ======================================

const photoInput =
document.getElementById("photo");

if (photoInput) {

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        document
        .getElementById("photoPreview")
        .src = e.target.result;

    };

    reader.readAsDataURL(file);

});

}
