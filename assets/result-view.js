// ======================================
// Result View System
// ======================================

// URL Parameter
const params = new URLSearchParams(window.location.search);
const resultId = params.get("id");

if (!resultId) {

    alert("কোনো Result নির্বাচন করা হয়নি!");

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

    if (error || !data) {

        console.error(error);

        alert("Result পাওয়া যায়নি!");

        window.location.href = "admin-result.html";

        return;

    }

    // ==========================
    // Basic Information
    // ==========================

    document.getElementById("student_name").innerText =
        data.student_name || "";

    document.getElementById("roll").innerText =
        data.roll || "";

    document.getElementById("class").innerText =
        data.class || "";

    document.getElementById("bangla").innerText =
        data.bangla || 0;

    document.getElementById("english").innerText =
        data.english || 0;

    document.getElementById("math").innerText =
        data.math || 0;

    document.getElementById("arabic").innerText =
        data.arabic || 0;

    document.getElementById("quran").innerText =
        data.quran || 0;

    document.getElementById("total").innerText =
        data.total || 0;

    document.getElementById("gpa").innerText =
        data.gpa || "0.00";

    document.getElementById("grade").innerText =
        data.grade || "F";

    // ==========================
    // PASS / FAIL
    // ==========================

    const status =
        document.getElementById("status");

    if (data.grade === "F") {

        status.innerHTML =
            '<span class="badge bg-danger">FAIL</span>';

    } else {

        status.innerHTML =
            '<span class="badge bg-success">PASS</span>';

    }

    // ==========================
    // Student Photo
    // ==========================

    const photo =
        document.getElementById("studentPhoto");

    if (data.photo && data.photo !== "") {

        photo.src = data.photo;

    } else {

        photo.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(data.student_name) +
            "&background=198754&color=ffffff&size=300";

    } 
    // ==========================
    // Merit Position
    // ==========================

    const { data: classResults } = await window.supabaseClient

        .from("results")

        .select("id,total")

        .eq("class", data.class)

        .order("total", { ascending: false });

    if (classResults) {

        const rank =
            classResults.findIndex(r => r.id == data.id) + 1;

        const position =
            document.getElementById("position");

        const achievement =
            document.getElementById("achievement");

        if (position) {

            let badge = "";

            if (rank === 1) {

                badge =
                '<span class="badge bg-warning text-dark">🥇 1st</span>';

            }

            else if (rank === 2) {

                badge =
                '<span class="badge bg-secondary">🥈 2nd</span>';

            }

            else if (rank === 3) {

                badge =
                '<span class="badge bg-danger">🥉 3rd</span>';

            }

            else {

                badge =
                '<span class="badge bg-dark">#' + rank + '</span>';

            }

            position.innerHTML = badge;

        }

        // ==========================
        // Achievement
        // ==========================

        if (achievement) {

            if (rank === 1) {

                achievement.innerHTML =
                "🏆 Class Topper";

            }

            else if (rank <= 3) {

                achievement.innerHTML =
                "⭐ Top 3 Student";

            }

            else if (rank <= 10) {

                achievement.innerHTML =
                "🌟 Excellent";

            }

            else {

                achievement.innerHTML =
                "✅ Good Performance";

            }

        }

    }

    // ==========================
    // QR Code
    // ==========================

    const qrBox =
        document.getElementById("qrcode");

    if (qrBox && typeof QRCode !== "undefined") {

        qrBox.innerHTML = "";

        new QRCode(qrBox, {

            text: window.location.href,

            width: 120,

            height: 120

        });

    }

} // <-- loadResult() এখানে শেষ হবে
// ======================================
// Start
// ======================================

loadResult();

// ======================================
// Print Result
// ======================================

function printResult() {

    window.print();

}

// ======================================
// Download PDF
// ======================================

async function downloadPDF() {

    const card = document.getElementById("resultCard");

    if (!card) {

        alert("Result Card পাওয়া যায়নি!");

        return;

    }

    try {

        const canvas = await html2canvas(card, {

            scale: 2,

            useCORS: true,

            allowTaint: true,

            backgroundColor: "#ffffff"

        });

        const imgData = canvas.toDataURL("image/png");

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();

        const pageHeight =
            (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            pageWidth,
            pageHeight
        );

        const roll =
            document.getElementById("roll").innerText || "Unknown";

        const student =
            document.getElementById("student_name")
            .innerText
            .replace(/\s+/g, "_");

        pdf.save(`Result_${student}_${roll}.pdf`);

    } catch (err) {

        console.error(err);

        alert("❌ PDF তৈরি করা যায়নি!");

    }

}



