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

        console.error(error);

        alert("Result পাওয়া যায়নি");

        window.location.href = "admin-result.html";

        return;

    }

    document.getElementById("student_name").innerText = data.student_name || "";
    document.getElementById("roll").innerText = data.roll || "";
    document.getElementById("class").innerText = data.class || "";

    document.getElementById("bangla").innerText = data.bangla || 0;
    document.getElementById("english").innerText = data.english || 0;
    document.getElementById("math").innerText = data.math || 0;
    document.getElementById("arabic").innerText = data.arabic || 0;
    document.getElementById("quran").innerText = data.quran || 0;

    document.getElementById("total").innerText = data.total || 0;
    document.getElementById("gpa").innerText = data.gpa || "0.00";
    document.getElementById("grade").innerText = data.grade || "F";

    // Pass / Fail

    const status = document.getElementById("status");

    if (status) {

        if (data.grade === "F") {

            status.innerHTML =
                '<span class="badge bg-danger">FAIL</span>';

        } else {

            status.innerHTML =
                '<span class="badge bg-success">PASS</span>';

        }

    }

}

// ======================================

loadResult();

// ======================================
// Print
// ======================================

function printResult() {

    window.print();

}

// ======================================
// Professional PDF Download
// ======================================

async function downloadPDF() {

    const card = document.getElementById("resultCard");

    if (!card) {

        alert("Result Card পাওয়া যায়নি");

        return;

    }

    const canvas = await html2canvas(card, {

        scale: 2,

        useCORS: true,

        backgroundColor: "#ffffff"

    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();

    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(

        imgData,

        "PNG",

        0,

        0,

        pageWidth,

        pageHeight

    );

    pdf.save("Student_Result.pdf");

}
