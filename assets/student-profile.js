// ======================================
// STUDENT PROFILE V1
// ======================================

// URL থেকে id নেওয়া
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// id না থাকলে ফিরে যাবে
if (!id) {
    alert("Student ID পাওয়া যায়নি");
    window.location.href = "students.html";
}

// Student Load
async function loadStudent() {

    const { data, error } = await window.supabaseClient
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        alert(error.message);
        console.error(error);
        return;
    }

    if (!data) {
        alert("Student পাওয়া যায়নি");
        window.location.href = "students.html";
        return;
    }

    // Photo
    document.getElementById("studentPhoto").src =
        data.photo_url || "https://placehold.co/200x200?text=Photo";

    // Information
    document.getElementById("studentId").textContent =
        data.student_id || "-";

    document.getElementById("fullName").textContent =
        data.full_name || "-";

    document.getElementById("fatherName").textContent =
        data.father_name || "-";

    document.getElementById("motherName").textContent =
        data.mother_name || "-";

    document.getElementById("mobile").textContent =
        data.mobile || "-";

    document.getElementById("studentClass").textContent =
        data.class || "-";

    document.getElementById("address").textContent =
        data.address || "-";

    document.getElementById("status").textContent =
        data.status || "Pending";
}

// Start
loadStudent();
