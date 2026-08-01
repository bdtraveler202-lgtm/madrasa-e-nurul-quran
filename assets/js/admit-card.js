/* ==========================================
   MADRASA-E NURUL QURAN
   ADMIT CARD
========================================== */

const db = window.supabaseClient;

async function checkSession(){

const {data:{session}}=await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

async function loadStudent(){

const studentID=new URLSearchParams(location.search).get("id");

if(!studentID){

alert("Student ID Missing");

return;

}

const {data,error}=await db

.from("students")

.select("*")

.eq("student_id",studentID)

.single();

if(error||!data){

alert("Student Not Found");

return;

}

document.getElementById("photo").src=
data.photo_url || "assets/img/default-user.png";

document.getElementById("studentID").textContent=
data.student_id;

document.getElementById("studentName").textContent=
data.student_name_bn || data.student_name_en;

document.getElementById("department").textContent=
data.department;

document.getElementById("studentClass").textContent=
data.class_name;

document.getElementById("roll").textContent=
data.roll;

document.getElementById("section").textContent=
data.section;

document.getElementById("session").textContent=
data.session;

document.getElementById("examDate").textContent=
new Date().toLocaleDateString();

const qrText=
location.origin+
"/student-profile.html?id="+
encodeURIComponent(data.student_id);

document.getElementById("qrCode").src=
"https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+
encodeURIComponent(qrText);

}

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await loadStudent();

});
