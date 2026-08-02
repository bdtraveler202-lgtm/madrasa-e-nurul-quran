/* ===========================================
   MADRASA ERP v2.0
   ADMIN.JS
=========================================== */

const db = window.supabaseClient;

/* ===========================================
SESSION
=========================================== */

async function checkSession(){

const {data:{session}}=await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

/* ===========================================
DATE & CLOCK
=========================================== */

function startClock(){

function update(){

const now=new Date();

document.getElementById("todayDate").textContent=

now.toLocaleDateString("en-GB",{

weekday:"long",

day:"2-digit",

month:"long",

year:"numeric"

});

document.getElementById("liveClock").textContent=

now.toLocaleTimeString();

}

update();

setInterval(update,1000);

}

/* ===========================================
DASHBOARD COUNTS
=========================================== */

async function loadCounts(){

const students=await db

.from("students")

.select("*",{count:"exact",head:true});

document.getElementById("cardStudents").textContent=

students.count||0;

const teachers=await db

.from("teachers")

.select("*",{count:"exact",head:true});

document.getElementById("cardTeachers").textContent=

teachers.count||0;

const employees=await db

.from("employees")

.select("*",{count:"exact",head:true});

document.getElementById("cardEmployees").textContent=

employees.count||0;

const results=await db

.from("results")

.select("*",{count:"exact",head:true});

document.getElementById("totalResults").textContent=

results.count||0;

} 
/* ===========================================
TODAY COLLECTION
=========================================== */

async function loadTodayCollection(){

const today=new Date().toISOString().split("T")[0];

const {data}=await db

.from("fees")

.select("paid")

.eq("payment_date",today);

let total=0;

(data||[]).forEach(item=>{

total+=Number(item.paid||0);

});

document.getElementById("todayCollection").textContent=

"৳"+total.toLocaleString();

}

/* ===========================================
ATTENDANCE SUMMARY
=========================================== */

async function loadAttendance(){

const today=new Date().toISOString().split("T")[0];

const {data}=await db

.from("attendance")

.select("status")

.eq("attendance_date",today);

let present=0;

let absent=0;

(data||[]).forEach(item=>{

if(item.status==="Present") present++;

else absent++;

});

document.getElementById("presentCount").textContent=present;

document.getElementById("absentCount").textContent=absent;

const total=present+absent;

const percent=

total===0?0:Math.round((present/total)*100);

document.getElementById("todayAttendance").textContent=

percent+"%";

document.getElementById("presentBar").style.width=

percent+"%";

document.getElementById("absentBar").style.width=

(100-percent)+"%";

}

/* ===========================================
RECENT STUDENTS
=========================================== */

async function loadRecentStudents(){

const {data}=await db

.from("students")

.select("*")

.order("created_at",{ascending:false})

.limit(5);

const tbody=document.getElementById("recentStudents");

tbody.innerHTML="";

(data||[]).forEach(student=>{

tbody.innerHTML+=`

<tr>

<td>

<img
src="${student.photo_url||'assets/img/default-user.png'}"
style="width:40px;height:40px;border-radius:50%;object-fit:cover;">

</td>

<td>

${student.student_name_bn||student.student_name_en||"-"}

</td>

<td>${student.class_name||"-"}</td>

<td>${student.roll||"-"}</td>

<td>${student.father_mobile||student.guardian_mobile||"-"}</td>

</tr>

`;

});

}
/* ===========================================
RECENT TEACHERS
=========================================== */

async function loadRecentTeachers(){

const {data}=await db

.from("teachers")

.select("*")

.order("created_at",{ascending:false})

.limit(5);

const tbody=document.getElementById("recentTeachers");

tbody.innerHTML="";

(data||[]).forEach(teacher=>{

tbody.innerHTML+=`

<tr>

<td>

<img
src="${teacher.photo_url||'assets/img/default-user.png'}"
style="width:40px;height:40px;border-radius:50%;object-fit:cover;">

</td>

<td>${teacher.name||"-"}</td>

<td>${teacher.department||"-"}</td>

<td>${teacher.mobile||"-"}</td>

</tr>

`;

});

}

/* ===========================================
RECENT PAYMENTS
=========================================== */

async function loadRecentPayments(){

const {data}=await db

.from("fees")

.select("*")

.order("payment_date",{ascending:false})

.limit(5);

const tbody=document.getElementById("recentPayments");

tbody.innerHTML="";

(data||[]).forEach(item=>{

tbody.innerHTML+=`

<tr>

<td>${item.receipt_no||"-"}</td>

<td>${item.student_id||"-"}</td>

<td>৳${Number(item.paid||0).toLocaleString()}</td>

<td>${item.payment_date||"-"}</td>

</tr>

`;

});

}

/* ===========================================
NOTICE
=========================================== */

async function loadNotice(){

const {data}=await db

.from("notices")

.select("*")

.order("created_at",{ascending:false})

.limit(5);

const ticker=document.getElementById("noticeTicker");

if(!ticker) return;

if(!data||data.length===0){

ticker.textContent="No Notice Available";

return;

}

ticker.textContent=

data.map(n=>n.title).join("  |  ");

}

/* ===========================================
LOGOUT
=========================================== */

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",async(e)=>{

e.preventDefault();

await db.auth.signOut();

location.href="login.html";

});

}

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

startClock();

await loadCounts();

await loadTodayCollection();

await loadAttendance();

await loadRecentStudents();

await loadRecentTeachers();

await loadRecentPayments();

await loadNotice();

});


