/* ===========================================
   MADRASA ERP v2.0
   STUDENTS.JS
=========================================== */

const db = window.supabaseClient;

let editID = null;

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
ELEMENTS
=========================================== */

const studentForm=document.getElementById("studentForm");

const studentTable=document.getElementById("studentTable");

const searchBtn=document.getElementById("searchBtn");

const searchStudent=document.getElementById("searchStudent");

const departmentFilter=document.getElementById("departmentFilter");

const classFilter=document.getElementById("classFilter");

const statusFilter=document.getElementById("statusFilter");

const logoutBtn=document.getElementById("logoutBtn");

/* ===========================================
AUTO STUDENT ID
=========================================== */

async function generateStudentID(){

const year=new Date().getFullYear();

const {count}=await db

.from("students")

.select("*",{

count:"exact",

head:true

});

const next=(count||0)+1;

const id=

"STD"+year+

String(next).padStart(5,"0");

document.getElementById("studentID").value=id;

}

/* ===========================================
CLASS LOAD
=========================================== */

const classes={

Nurani:[

"শিশু",

"প্রথম",

"দ্বিতীয়",
   
"তৃতীয়",

"চতুর্থ",

"পঞ্চম"

],

Nazera:[

"নাজেরা-১",

"নাজেরা-২",

"নাজেরা-৩"

],

Hifz:[

"হিফজ-১",

"হিফজ-২",

"হিফজ-৩",

"হিফজ-৪"

]

};

document

.getElementById("department")

.addEventListener("change",e=>{

const select=

document.getElementById("studentClass");

select.innerHTML="";

(classes[e.target.value]||[])

.forEach(item=>{

select.innerHTML+=`

<option value="${item}">

${item}

</option>

`;

});

});

/* ===========================================
PHOTO UPLOAD
=========================================== */

async function uploadPhoto(file){

if(!file) return "";

const ext=file.name.split(".").pop();

const fileName=

`students/${Date.now()}.${ext}`;

const {error}=await db.storage

.from("students")

.upload(fileName,file,{

upsert:true

});

if(error) throw error;

const {data}=db.storage

.from("students")

.getPublicUrl(fileName);

return data.publicUrl;

} 
/* ===========================================
SAVE STUDENT
=========================================== */

studentForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

const photoFile=document.getElementById("photo").files[0];

let photo="";

if(photoFile){

photo=await uploadPhoto(photoFile);

}

const student = {

student_id: document.getElementById("studentID").value,

full_name: document.getElementById("studentName").value,

father_name: document.getElementById("fatherName").value,

mother_name: document.getElementById("motherName").value,

mobile: document.getElementById("mobile").value,

guardian_mobile: document.getElementById("guardianMobile").value,

department: document.getElementById("department").value,

class: document.getElementById("studentClass").value,

roll: Number(document.getElementById("roll").value) || 0,

gender: document.getElementById("gender").value,

dob: document.getElementById("dob").value,

blood_group: document.getElementById("bloodGroup").value,

religion: document.getElementById("religion").value,

present_address: document.getElementById("presentAddress").value,

permanent_address: document.getElementById("permanentAddress").value,

status: document.getElementById("status").value,

admission_date: document.getElementById("admissionDate").value,

photo: photo

};
   
let error;

if(editID){

({error}=await db

.from("students")

.update(student)

.eq("id",editID));

}else{

({error}=await db

.from("students")

.insert(student));

}

if(error) throw error;

alert("Student Saved Successfully");

studentForm.reset();

editID=null;

await generateStudentID();

await loadStudents();

}catch(err){

console.error(err);

alert(err.message);

}

});
/* ===========================================
LOAD STUDENTS
=========================================== */

async function loadStudents(){

studentTable.innerHTML=`
<tr>
<td colspan="10" class="text-center">
Loading...
</td>
</tr>`;

let query=db
.from("students")
.select("*")
.order("created_at",{ascending:false});

if(searchStudent.value.trim()){

query=query.or(
`id.ilike.%${searchStudent.value}%,name.ilike.%${searchStudent.value}%,mobile.ilike.%${searchStudent.value}%`
);

}

if(departmentFilter.value){

query=query.eq(
"department",
departmentFilter.value
);

}

if(classFilter.value){

query=query.eq(
"class",
classFilter.value
);

}

if(statusFilter.value){

query=query.eq(
"status",
statusFilter.value
);

}

const {data,error}=await query;

if(error){

console.error(error);

return;

}

studentTable.innerHTML="";

if(!data.length){

studentTable.innerHTML=`
<tr>
<td colspan="10" class="text-center">
No Student Found
</td>
</tr>`;

return;

}

data.forEach(student=>{

studentTable.innerHTML+=`

<tr>

<td>

<img
src="${student.photo||'assets/img/avatar.png'}"
class="student-photo">

</td>

<td>${student.id}</td>

<td>${student.name}</td>

<td>${student.class}</td>

<td>${student.mobile||"-"}</td>

<td>${student.department||"-"}</td>

<td>${student.status||"-"}</td>

<td>

<a
href="student-profile.html?id=${student.id}"
class="btn btn-info btn-sm">

<i class="fa-solid fa-user"></i>

</a>

<button
class="btn btn-warning btn-sm"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/* ===========================================
SEARCH & FILTER
=========================================== */

searchBtn.addEventListener("click",loadStudents);

searchStudent.addEventListener("keyup",e=>{

if(e.key==="Enter") loadStudents();

});

departmentFilter.addEventListener("change",loadStudents);

classFilter.addEventListener("change",loadStudents);

statusFilter.addEventListener("change",loadStudents);
/* ===========================================
EDIT STUDENT
=========================================== */

async function editStudent(id){

const {data,error}=await db
.from("students")
.select("*")
.eq("id",id)
.single();

if(error){
alert(error.message);
return;
}

editID=id;

document.getElementById("studentID").value=data.id||"";
document.getElementById("studentName").value=data.name||"";
document.getElementById("fatherName").value=data.father_name||"";
document.getElementById("motherName").value=data.mother_name||"";
document.getElementById("mobile").value=data.mobile||"";
document.getElementById("guardianMobile").value=data.guardian_mobile||"";
document.getElementById("department").value=data.department||"";

document.getElementById("department").dispatchEvent(
new Event("change")
);

setTimeout(()=>{

document.getElementById("studentClass").value=data.class||"";

},200);

document.getElementById("roll").value=data.roll||"";
document.getElementById("gender").value=data.gender||"";
document.getElementById("dob").value=data.dob||"";
document.getElementById("bloodGroup").value=data.blood_group||"";
document.getElementById("religion").value=data.religion||"";
document.getElementById("presentAddress").value=data.present_address||"";
document.getElementById("permanentAddress").value=data.permanent_address||"";
document.getElementById("status").value=data.status||"";
document.getElementById("admissionDate").value=data.admission_date||"";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* ===========================================
DELETE STUDENT
=========================================== */

async function deleteStudent(id){

if(!confirm("Delete this student?")) return;

const {error}=await db
.from("students")
.delete()
.eq("id",id);

if(error){

alert(error.message);

return;

}

alert("Student Deleted");

loadStudents();

}

/* ===========================================
DASHBOARD UPDATE
=========================================== */

async function updateDashboard(){

const {count}=await db
.from("students")
.select("*",{
count:"exact",
head:true
});

const card=document.getElementById("cardStudents");

if(card){

card.textContent=count||0;

}

} 
/* ===========================================
LOGOUT
=========================================== */

if(logoutBtn){

logoutBtn.addEventListener("click",async(e)=>{

e.preventDefault();

if(!confirm("Logout করবেন?")) return;

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

await generateStudentID();

await loadStudents();

await updateDashboard();

});
