/* ==========================================
   TEACHER ID CARD
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

async function loadTeacher(){

const teacherID=new URLSearchParams(location.search).get("id");

if(!teacherID){

alert("Teacher ID Missing");

return;

}

const {data,error}=await db

.from("teachers")

.select("*")

.eq("teacher_id",teacherID)

.single();

if(error||!data){

alert("Teacher Not Found");

return;

}

document.getElementById("photo").src=
data.photo_url || "assets/img/default-user.png";

document.getElementById("teacherID").textContent=
data.teacher_id;

document.getElementById("teacherName").textContent=
data.name;

document.getElementById("designation").textContent=
data.designation;

document.getElementById("department").textContent=
data.department;

document.getElementById("mobile").textContent=
data.mobile;

const qrText=
location.origin+
"/teacher-id.html?id="+
encodeURIComponent(data.teacher_id);

document.getElementById("qrCode").src=
"https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+
encodeURIComponent(qrText);

}

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await loadTeacher();

});
