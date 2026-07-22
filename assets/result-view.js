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
// ======================================
// Download PDF
// ======================================

async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Madrasa-E Nurul Quran", 20, 20);

    doc.setFontSize(14);
    doc.text("Academic Result Sheet", 20, 30);

    doc.setFontSize(12);

    doc.text("Student Name : " + document.getElementById("student_name").innerText,20,50);

    doc.text("Roll : " + document.getElementById("roll").innerText,20,60);

    doc.text("Class : " + document.getElementById("class").innerText,20,70);

    doc.text("Bangla : " + document.getElementById("bangla").innerText,20,90);

    doc.text("English : " + document.getElementById("english").innerText,20,100);

    doc.text("Math : " + document.getElementById("math").innerText,20,110);

    doc.text("Arabic : " + document.getElementById("arabic").innerText,20,120);

    doc.text("Quran : " + document.getElementById("quran").innerText,20,130);

    doc.text("Total : " + document.getElementById("total").innerText,20,145);

    doc.text("GPA : " + document.getElementById("gpa").innerText,20,155);

    doc.text("Grade : " + document.getElementById("grade").innerText,20,165);

    doc.save("Student_Result.pdf");

}
