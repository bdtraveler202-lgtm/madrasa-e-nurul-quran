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
const statusFilter=document.getElementById("statusFilter");

const logoutBtn=document.getElementById("logoutBtn");

/* ===========================================
AUTO STUDENT ID
=========================================== */

async function generateStudentID(){

const year=new Date().getFullYear();

const {count}=await db
.from("students")
.select("*",{count:"exact",head:true});

const next=(count||0)+1;

document.getElementById("studentID").value=
"STD"+year+String(next).padStart(5,"0");

}

/* ===========================================
CLASS LIST
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
],

Kitab:[
"মিযান",
"নাহবেমীর",
"হেদায়াতুন নাহু",
"কাফিয়া",
"শরহে জামি",
"মিশকাত",
"দাওরায়ে হাদীস"
]

};

document.getElementById("department")
.addEventListener("change",()=>{

const dep=document.getElementById("department").value;

const cls=document.getElementById("studentClass");

cls.innerHTML="<option value=''>Select Class</option>";

(classes[dep]||[]).forEach(item=>{

cls.innerHTML+=`
<option value="${item}">
${item}
</option>`;

});

}); 
/* ===========================================
PHOTO UPLOAD
=========================================== */

async function uploadPhoto(file){

if(!file) return "";

const ext=file.name.split(".").pop();

const fileName=`students/${Date.now()}.${ext}`;

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

let photo="";

const photoInput=document.getElementById("photo");

if(photoInput && photoInput.files.length){

photo=await uploadPhoto(photoInput.files[0]);

}

const student={

student_id:document.getElementById("studentID").value,

full_name:document.getElementById("studentName").value,

father_name:document.getElementById("fatherName").value,

mother_name:document.getElementById("motherName").value,

mobile:document.getElementById("mobile").value,

guardian_mobile:document.getElementById("guardianMobile").value,

department:document.getElementById("department").value,

class_name:document.getElementById("studentClass").value,

roll:Number(document.getElementById("roll").value)||0,

gender:document.getElementById("gender").value,

dob:document.getElementById("dob").value,

blood_group:document.getElementById("bloodGroup").value,

religion:document.getElementById("religion").value,

present_address:document.getElementById("presentAddress").value,

permanent_address:document.getElementById("permanentAddress").value,

status:document.getElementById("status").value,

admission_date:document.getElementById("admissionDate").value,

photo_url:photo

};

const {error}=await db
.from("students")
.insert(student);

if(error) throw error;

alert("Student Saved Successfully");

studentForm.reset();

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
<td colspan="9" class="text-center">
Loading...
</td>
</tr>`;

let query=db
.from("students")
.select("*")
.order("created_at",{ascending:false});

if(searchStudent.value.trim()){

query=query.or(
`student_id.ilike.%${searchStudent.value}%,full_name.ilike.%${searchStudent.value}%,mobile.ilike.%${searchStudent.value}%`
);

}

if(departmentFilter.value){

query=query.eq(
"department",
departmentFilter.value
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
<td colspan="9" class="text-center">
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
src="${student.photo_url||'assets/img/default-user.png'}"
style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

</td>

<td>${student.student_id}</td>

<td>${student.full_name}</td>

<td>${student.department||"-"}</td>

<td>${student.class_name||"-"}</td>

<td>${student.roll||"-"}</td>

<td>${student.mobile||"-"}</td>

<td>

<span class="badge bg-success">

${student.status||"Active"}

</span>

</td>

<td>

<a
href="student-profile.html?id=${student.student_id}"
class="btn btn-info btn-sm">

<i class="fa-solid fa-eye"></i>

</a>

<button
class="btn btn-warning btn-sm"
onclick="editStudent('${student.student_id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteStudent('${student.student_id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/* ===========================================
SEARCH
=========================================== */

searchBtn.addEventListener("click",loadStudents);

searchStudent.addEventListener("keyup",e=>{

if(e.key==="Enter"){

loadStudents();

}

});

departmentFilter.addEventListener("change",loadStudents);

statusFilter.addEventListener("change",loadStudents);
/* ===========================================
EDIT STUDENT
=========================================== */

async function editStudent(studentID){

const {data,error}=await db
.from("students")
.select("*")
.eq("student_id",studentID)
.single();

if(error){

alert(error.message);

return;

}

editID=studentID;

document.getElementById("studentID").value=data.student_id||"";
document.getElementById("studentName").value=data.full_name||"";
document.getElementById("fatherName").value=data.father_name||"";
document.getElementById("motherName").value=data.mother_name||"";
document.getElementById("mobile").value=data.mobile||"";
document.getElementById("guardianMobile").value=data.guardian_mobile||"";
document.getElementById("department").value=data.department||"";

document
.getElementById("department")
.dispatchEvent(new Event("change"));

setTimeout(()=>{

document.getElementById("studentClass").value=data.class_name||"";

},100);

document.getElementById("roll").value=data.roll||"";
document.getElementById("gender").value=data.gender||"";
document.getElementById("dob").value=data.dob||"";
document.getElementById("bloodGroup").value=data.blood_group||"";
document.getElementById("religion").value=data.religion||"";
document.getElementById("status").value=data.status||"";
document.getElementById("admissionDate").value=data.admission_date||"";
document.getElementById("presentAddress").value=data.present_address||"";
document.getElementById("permanentAddress").value=data.permanent_address||"";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* ===========================================
DELETE STUDENT
=========================================== */

async function deleteStudent(studentID){

if(!confirm("Delete this student?")) return;

const {error}=await db
.from("students")
.delete()
.eq("student_id",studentID);

if(error){

alert(error.message);

return;

}

alert("Student Deleted Successfully");

loadStudents();

}

/* ===========================================
PRINT
=========================================== */

function printIDCard(studentID){

window.open(
`id-card.html?id=${studentID}`,
"_blank"
);

}

function printAdmitCard(studentID){

window.open(
`admit-card.html?id=${studentID}`,
"_blank"
);

}

/* ===========================================
LOGOUT
=========================================== */

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

await generateStudentID();

await loadStudents();

});
