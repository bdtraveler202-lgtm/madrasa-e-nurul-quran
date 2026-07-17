// ===============================
// Admin Dashboard
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

    // Total Students
    document.getElementById("totalStudents").innerText = data.length;

    // Nurani
    const nurani = data.filter(student => student.class === "নূরানী").length;
    document.getElementById("nurani").innerText = nurani;

    // Nazera
    const nazera = data.filter(student => student.class === "নাজেরা").length;
    document.getElementById("nazera").innerText = nazera;

    // Hifz
    const hifz = data.filter(student => student.class === "হিফজ").length;
    document.getElementById("hifz").innerText = hifz;

}

loadDashboard();
