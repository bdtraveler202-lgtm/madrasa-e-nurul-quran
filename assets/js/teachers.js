/* ===========================================
   MADRASA-E NURUL QURAN
   TEACHER.JS
=========================================== */

const db = window.supabaseClient;

const teacherForm = document.getElementById("teacherForm");
const teacherTable = document.getElementById("teacherTable");

let editingTeacherId = null;

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
AUTO ID
=========================================== */

async function generateTeacherID(){

const year=new Date().getFullYear();

const {count}=await db

.from("teachers")

.select("*",{

count:"exact",

head:true

});

const next=String((count||0)+1).padStart(4,"0");

document.getElementById("teacherID").value=

`T-${year}-${next}`;

}

/* ===========================================
PHOTO
=========================================== */

async function uploadPhoto(file){

if(!file) return "";

const fileName=

Date.now()+"_"+file.name;

const {error}=await db.storage

.from("teachers")

.upload(fileName,file);

if(error) throw error;

const {data}=db.storage

.from("teachers")

.getPublicUrl(fileName);

return data.publicUrl;

}

/* ===========================================
SAVE
=========================================== */

teacherForm.addEventListener("submit",saveTeacher);

async function saveTeacher(e){

e.preventDefault();

try{

let photo="";

const file=

document.getElementById("photo").files[0];

if(file){

photo=await uploadPhoto(file);

}

const teacher={

teacher_id:

document.getElementById("teacherID").value,

name:

document.getElementById("teacherName").value,

designation:

document.getElementById("designation").value,

department:

document.getElementById("department").value,

mobile:

document.getElementById("mobile").value,

email:

document.getElementById("email").value,

address:

document.getElementById("address").value,

salary:Number(

document.getElementById("salary").value||0

),

photo_url:photo

};

if(editingTeacherId){

const {error}=await db

.from("teachers")

.update(teacher)

.eq("id",editingTeacherId);

if(error) throw error;

editingTeacherId=null;

alert("Teacher Updated");

}else{

const {error}=await db

.from("teachers")

.insert(teacher);

if(error) throw error;

alert("Teacher Saved");

}

teacherForm.reset();

generateTeacherID();

loadTeachers();

}catch(err){

alert(err.message);

}

}
/* ===========================================
LOAD TEACHERS
=========================================== */

async function loadTeachers(){

const {data,error}=await db

.from("teachers")

.select("*")

.order("created_at",{ascending:false});

if(error){

console.error(error);

return;

}

teacherTable.innerHTML="";

if(!data || data.length===0){

teacherTable.innerHTML=`
<tr>
<td colspan="8" class="text-center">
No Teacher Found
</td>
</tr>
`;

return;

}

data.forEach(t=>{

teacherTable.innerHTML+=`

<tr>

<td>${t.teacher_id}</td>

<td>

<img
src="${t.photo_url || 'assets/img/default-user.png'}"
style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

</td>

<td>${t.name}</td>

<td>${t.department}</td>

<td>${t.designation}</td>

<td>${t.mobile}</td>

<td>৳${Number(t.salary).toLocaleString()}</td>

<td>

<button
class="btn btn-sm btn-info"
onclick="editTeacher('${t.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteTeacher('${t.id}')">

<i class="fa-solid fa-trash"></i>

</button>

<button
class="btn btn-sm btn-primary"
onclick="printTeacherID('${t.teacher_id}')">

<i class="fa-solid fa-id-card"></i>

</button>

</td>

</tr>

`;

});

}

/* ===========================================
EDIT
=========================================== */

async function editTeacher(id){

const {data,error}=await db

.from("teachers")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

editingTeacherId=id;

document.getElementById("teacherID").value=data.teacher_id;
document.getElementById("teacherName").value=data.name;
document.getElementById("designation").value=data.designation;
document.getElementById("department").value=data.department;
document.getElementById("mobile").value=data.mobile;
document.getElementById("email").value=data.email;
document.getElementById("address").value=data.address;
document.getElementById("salary").value=data.salary;

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/* ===========================================
DELETE
=========================================== */

async function deleteTeacher(id){

if(!confirm("Delete Teacher?")) return;

const {error}=await db

.from("teachers")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadTeachers();

}

/* ===========================================
PRINT ID
=========================================== */

function printTeacherID(id){

window.open(

"teacher-id.html?id="+
encodeURIComponent(id),

"_blank"

);

}

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await generateTeacherID();

await loadTeachers();

});
