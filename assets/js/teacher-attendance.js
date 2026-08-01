/* ===========================================
   MADRASA-E NURUL QURAN
   TEACHER ATTENDANCE.JS
=========================================== */

const db = window.supabaseClient;

const attendanceTable = document.getElementById("attendanceTable");
const attendanceDate = document.getElementById("attendanceDate");
const loadTeachersBtn = document.getElementById("loadTeachers");
const saveAttendanceBtn = document.getElementById("saveAttendance");

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
TODAY
=========================================== */

attendanceDate.value=new Date().toISOString().split("T")[0];

/* ===========================================
LOAD TEACHERS
=========================================== */

async function loadTeachers(){

attendanceTable.innerHTML=`
<tr>
<td colspan="6" class="text-center">
Loading...
</td>
</tr>
`;

const {data,error}=await db

.from("teachers")

.select("*")

.order("name");

if(error){

console.error(error);

return;

}

attendanceTable.innerHTML="";

if(!data || data.length===0){

attendanceTable.innerHTML=`
<tr>
<td colspan="6" class="text-center">
No Teacher Found
</td>
</tr>
`;

return;

}

data.forEach(t=>{

attendanceTable.innerHTML+=`

<tr>

<td>

<img
src="${t.photo_url || 'assets/img/default-user.png'}"
style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

</td>

<td>${t.teacher_id}</td>

<td>${t.name}</td>

<td>

<input
type="radio"
name="attendance_${t.teacher_id}"
value="Present"
checked>

</td>

<td>

<input
type="radio"
name="attendance_${t.teacher_id}"
value="Absent">

</td>

<td>

<input
type="radio"
name="attendance_${t.teacher_id}"
value="Leave">

</td>

</tr>

`;

});

}

/* ===========================================
SAVE ATTENDANCE
=========================================== */

async function saveAttendance(){

const date=attendanceDate.value;

const {data:teachers}=await db

.from("teachers")

.select("teacher_id");

for(const teacher of teachers){

const checked=document.querySelector(

`input[name="attendance_${teacher.teacher_id}"]:checked`

);

if(!checked) continue;

const record={

teacher_id:teacher.teacher_id,

attendance_date:date,

status:checked.value

};

const {data:existing}=await db

.from("teacher_attendance")

.select("id")

.eq("teacher_id",teacher.teacher_id)

.eq("attendance_date",date)

.maybeSingle();

if(existing){

await db

.from("teacher_attendance")

.update({

status:record.status

})

.eq("id",existing.id);

}else{

await db

.from("teacher_attendance")

.insert(record);

}

}

alert("Teacher Attendance Saved");

}

/* ===========================================
LOAD PREVIOUS
=========================================== */

async function loadPreviousAttendance(){

const date=attendanceDate.value;

const {data}=await db

.from("teacher_attendance")

.select("*")

.eq("attendance_date",date);

if(!data) return;

data.forEach(item=>{

const radio=document.querySelector(

`input[name="attendance_${item.teacher_id}"][value="${item.status}"]`

);

if(radio){

radio.checked=true;

}

});

}

/* ===========================================
EVENTS
=========================================== */

loadTeachersBtn.addEventListener("click",async()=>{

await loadTeachers();

setTimeout(loadPreviousAttendance,300);

});

attendanceDate.addEventListener("change",async()=>{

await loadTeachers();

setTimeout(loadPreviousAttendance,300);

});

saveAttendanceBtn.addEventListener("click",saveAttendance);

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await loadTeachers();

await loadPreviousAttendance();

});
