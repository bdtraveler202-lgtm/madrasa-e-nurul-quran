/* ==========================================
   ID Card
   Madrasa-E Nurul Quran
========================================== */

const params = new URLSearchParams(window.location.search);
const studentID = params.get("id");

async function loadIDCard(){

    if(!studentID){

        alert("Student ID Missing");

        return;

    }

    const {data,error}=await supabase

    .from("students")

    .select("*")

    .eq("student_id",studentID)

    .single();

    if(error){

        alert(error.message);

        return;

    }

    document.getElementById("photo").src =
    data.photo_url || "assets/img/default-user.png";

    document.getElementById("studentID").textContent =
    data.student_id;

    document.getElementById("studentName").textContent =
    data.student_name_bn || data.student_name_en || "";

    document.getElementById("department").textContent =
    data.department || "";

    document.getElementById("studentClass").textContent =
    data.class_name || "";

    document.getElementById("roll").textContent =
    data.roll || "";

    document.getElementById("session").textContent =
    data.session || "";

    document.getElementById("mobile").textContent =
    data.guardian_mobile || data.father_mobile || "";

    document.getElementById("qrCode").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
    encodeURIComponent(data.student_id);

}

document.addEventListener(
    "DOMContentLoaded",
    loadIDCard
);
