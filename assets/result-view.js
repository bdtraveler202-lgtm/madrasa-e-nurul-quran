// ======================================
// Result View
// ======================================

const resultId = localStorage.getItem("result_id");

if (!resultId) {

    alert("কোনো Result নির্বাচন করা হয়নি");

    window.location.href = "admin-result.html";

}

// ======================================
// Load Result
// ======================================

async function loadResult() {

    const { data, error } = await window.supabaseClient

        .from("results")

        .select("*")

        .eq("id", resultId)

        .single();

    if (error) {

        alert("Result পাওয়া যায়নি");

        window.location.href = "admin-result.html";

        return;

    }

    document.getElementById("student_name").innerText = data.student_name;

    document.getElementById("roll").innerText = data.roll;

    document.getElementById("class").innerText = data.class;

    document.getElementById("bangla").innerText = data.bangla;

    document.getElementById("english").innerText = data.english;

    document.getElementById("math").innerText = data.math;

    document.getElementById("arabic").innerText = data.arabic;

    document.getElementById("quran").innerText = data.quran;

    document.getElementById("total").innerText = data.total;

    document.getElementById("gpa").innerText = data.gpa;

    document.getElementById("grade").innerText = data.grade;

}

// ======================================

loadResult();
