/* ===========================================
   MADRASA-E NURUL QURAN (MNQ)
   STUDENTS.JS v3.0
=========================================== */

const db = window.supabaseClient;

let editID = null;

/* ===========================================
CHECK LOGIN SESSION
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
GET ELEMENTS
=========================================== */

const studentForm=document.getElementById("studentForm");

const studentTable=document.getElementById("studentTable");

const searchBtn=document.getElementById("searchBtn");

const searchStudent=document.getElementById("searchStudent");

const department=document.getElementById("department");

const studentClass=document.getElementById("studentClass");

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

.select("*",{

count:"exact",

head:true

});

const next=(count||0)+1;

document.getElementById("studentID").value=

"MNQ-"+year+"-"+String(next).padStart(5,"0");

}

/* ===========================================
CLASS LIST
=========================================== */

const classList={

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

"হিফজ-৪",

"হিফজ-৫"

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

department.addEventListener("change",()=>{

studentClass.innerHTML="<option value=''>Select Class</option>";

(classList[department.value]||[]).forEach(cls=>{

studentClass.innerHTML+=`

<option value="${cls}">

${cls}

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

let photoUrl="";

const photo=document.getElementById("photo");

if(photo && photo.files.length){

photoUrl=await uploadPhoto(photo.files[0]);

}

const student={

student_id:document.getElementById("studentID").value,

session:document.getElementById("session").value,

admission_date:document.getElementById("admissionDate").value,

full_name_bn:document.getElementById("studentNameBn").value,

full_name_en:document.getElementById("studentNameEn").value,

department:document.getElementById("department").value,

class_name:document.getElementById("studentClass").value,

roll:Number(document.getElementById("roll").value)||0,

gender:document.getElementById("gender").value,

dob:document.getElementById("dob").value,

blood_group:document.getElementById("bloodGroup").value,

religion:document.getElementById("religion").value,

birth_certificate:document.getElementById("birthCertificate").value,

father_name:document.getElementById("fatherName").value,

father_mobile:document.getElementById("fatherMobile").value,

father_occupation:document.getElementById("fatherOccupation").value,

mother_name:document.getElementById("motherName").value,

mother_mobile:document.getElementById("motherMobile").value,

mother_occupation:document.getElementById("motherOccupation").value,

guardian_name:document.getElementById("guardianName").value,

guardian_relation:document.getElementById("guardianRelation").value,

guardian_mobile:document.getElementById("guardianMobile").value,

emergency_contact:document.getElementById("emergencyContact").value,

village:document.getElementById("village").value,

post_office:document.getElementById("postOffice").value,

upazila:document.getElementById("upazila").value,

district:document.getElementById("district").value,

present_address:document.getElementById("presentAddress").value,

permanent_address:document.getElementById("permanentAddress").value,

admission_fee:Number(document.getElementById("admissionFee").value)||0,

monthly_fee:Number(document.getElementById("monthlyFee").value)||0,

status:document.getElementById("status").value,

photo_url:photoUrl

};

let error;

if(editID){

({error}=await db

.from("students")

.update(student)

.eq("student_id",editID));

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
`student_id.ilike.%${searchStudent.value}%,full_name_bn.ilike.%${searchStudent.value}%,guardian_mobile.ilike.%${searchStudent.value}%`
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
style="
width:50px;
height:50px;
border-radius:50%;
object-fit:cover;
">

</td>

<td>${student.student_id}</td>

<td>${student.full_name_bn}</td>

<td>${student.department}</td>

<td>${student.class_name}</td>

<td>${student.roll}</td>

<td>${student.guardian_mobile||"-"}</td>

<td>

<span class="badge bg-${student.status==="Active"?"success":"danger"}">

${student.status}

</span>

</td>

<td>

<button
class="btn btn-info btn-sm"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="btn btn-primary btn-sm"
onclick="printIDCard('${student.student_id}')">

<i class="fa-solid fa-id-card"></i>

</button>

<button
class="btn btn-success btn-sm"
onclick="printAdmitCard('${student.student_id}')">

<i class="fa-solid fa-file-lines"></i>

</button>

<button
class="btn btn-secondary btn-sm"
onclick="printApplicationForm('${student.student_id}')">

<i class="fa-solid fa-print"></i>

</button>

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

/* Dashboard Counter */

const card=document.getElementById("cardStudents");

if(card){

card.innerText=data.length;

}

}

/* ===========================================
SEARCH EVENTS
=========================================== */

searchBtn.addEventListener("click",loadStudents);

searchStudent.addEventListener("keyup",(e)=>{

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
document.getElementById("session").value=data.session||"";
document.getElementById("admissionDate").value=data.admission_date||"";

document.getElementById("studentNameBn").value=data.full_name_bn||"";
document.getElementById("studentNameEn").value=data.full_name_en||"";

document.getElementById("department").value=data.department||"";

department.dispatchEvent(new Event("change"));

setTimeout(()=>{

document.getElementById("studentClass").value=data.class_name||"";

},100);

document.getElementById("roll").value=data.roll||"";

document.getElementById("gender").value=data.gender||"";

document.getElementById("dob").value=data.dob||"";

document.getElementById("bloodGroup").value=data.blood_group||"";

document.getElementById("religion").value=data.religion||"";

document.getElementById("birthCertificate").value=data.birth_certificate||"";

document.getElementById("fatherName").value=data.father_name||"";

document.getElementById("fatherMobile").value=data.father_mobile||"";

document.getElementById("fatherOccupation").value=data.father_occupation||"";

document.getElementById("motherName").value=data.mother_name||"";

document.getElementById("motherMobile").value=data.mother_mobile||"";

document.getElementById("motherOccupation").value=data.mother_occupation||"";

document.getElementById("guardianName").value=data.guardian_name||"";

document.getElementById("guardianRelation").value=data.guardian_relation||"";

document.getElementById("guardianMobile").value=data.guardian_mobile||"";

document.getElementById("emergencyContact").value=data.emergency_contact||"";

document.getElementById("village").value=data.village||"";

document.getElementById("postOffice").value=data.post_office||"";

document.getElementById("upazila").value=data.upazila||"";

document.getElementById("district").value=data.district||"";

document.getElementById("presentAddress").value=data.present_address||"";

document.getElementById("permanentAddress").value=data.permanent_address||"";

document.getElementById("admissionFee").value=data.admission_fee||0;

document.getElementById("monthlyFee").value=data.monthly_fee||0;

document.getElementById("status").value=data.status||"Active";

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
VIEW PROFILE
=========================================== */

function viewStudent(studentID){

window.open(
`student-profile.html?id=${studentID}`,
"_blank"
);

}

/* ===========================================
PRINT FUNCTIONS
=========================================== */

function printIDCard(studentID){

window.open(
`javascript:alert('ID Card Print will be added in Part 5\\nStudent ID: ${studentID}')`
);

}

function printAdmitCard(studentID){

window.open(
`javascript:alert('Admit Card Print will be added in Part 5\\nStudent ID: ${studentID}')`
);

}

/* ===========================================
LOGOUT
=========================================== */

logoutBtn.addEventListener("click",async(e)=>{

e.preventDefault();

await db.auth.signOut();

location.href="login.html";

});

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await generateStudentID();

await loadStudents();

});
/* ===========================================
APPLICATION FORM PRINT
=========================================== */

async function printApplicationForm(studentID){

try{

const {data,error}=await db
.from("students")
.select("*")
.eq("student_id",studentID)
.single();

if(error) throw error;

const win=window.open("","_blank");

const photo=data.photo_url||"assets/img/default-user.png";

const qr=
`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${data.student_id}`;

win.document.write(`
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Admission Application</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>

body{
font-family:Arial,sans-serif;
padding:25px;
}

.container{
max-width:900px;
margin:auto;
border:3px solid #000;
padding:20px;
}

.header{
display:flex;
justify-content:space-between;
align-items:center;
border-bottom:2px solid #000;
padding-bottom:15px;
margin-bottom:20px;
}

.logo{
width:90px;
height:90px;
}

.photo{
width:120px;
height:140px;
border:1px solid #000;
object-fit:cover;
}

.title{
text-align:center;
flex:1;
}

table{
width:100%;
}

table td{
padding:8px;
border:1px solid #999;
}

.section{
background:#0d6efd;
color:#fff;
padding:8px;
margin-top:20px;
font-weight:bold;
}

.sign{
margin-top:70px;
display:flex;
justify-content:space-between;
text-align:center;
}

.sign div{
width:30%;
border-top:1px solid #000;
padding-top:8px;
}

@media print{

button{
display:none;
}

}

</style>

</head>

<body>

<div class="text-center mb-3">

<button onclick="window.print()" class="btn btn-success">

Print Form

</button>

</div>

<div class="container">

<div class="header">

<img src="assets/img/logo.png" class="logo">

<div class="title">

<h2>মাদরাসা-ই নূরুল কুরআন</h2>

<h5>Admission Application Form</h5>

<p>Vollobpur, Dighuli, Chandraganj, Lakshmipur</p>

</div>

<img src="${photo}" class="photo">

</div>
<div class="section">

Student Information

</div>

<table>

<tr>

<td width="25%"><b>Student ID</b></td>

<td>${data.student_id}</td>

<td width="25%"><b>Admission Date</b></td>

<td>${data.admission_date||""}</td>

</tr>

<tr>

<td><b>Session</b></td>

<td>${data.session||""}</td>

<td><b>Department</b></td>

<td>${data.department||""}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${data.class_name||""}</td>

<td><b>Roll</b></td>

<td>${data.roll||""}</td>

</tr>

<tr>

<td><b>Name (Bangla)</b></td>

<td>${data.full_name_bn||""}</td>

<td><b>Name (English)</b></td>

<td>${data.full_name_en||""}</td>

</tr>

<tr>

<td><b>Date of Birth</b></td>

<td>${data.dob||""}</td>

<td><b>Gender</b></td>

<td>${data.gender||""}</td>

</tr>

<tr>

<td><b>Blood Group</b></td>

<td>${data.blood_group||""}</td>

<td><b>Religion</b></td>

<td>${data.religion||""}</td>

</tr>

<tr>

<td><b>Birth Certificate</b></td>

<td colspan="3">

${data.birth_certificate||""}

</td>

</tr>

</table>

<div class="section">

Father Information

</div>

<table>

<tr>

<td width="25%"><b>Father Name</b></td>

<td>${data.father_name||""}</td>

<td width="25%"><b>Mobile</b></td>

<td>${data.father_mobile||""}</td>

</tr>

<tr>

<td><b>Occupation</b></td>

<td colspan="3">

${data.father_occupation||""}

</td>

</tr>

</table>

<div class="section">

Mother Information

</div>

<table>

<tr>

<td width="25%"><b>Mother Name</b></td>

<td>${data.mother_name||""}</td>

<td width="25%"><b>Mobile</b></td>

<td>${data.mother_mobile||""}</td>

</tr>

<tr>

<td><b>Occupation</b></td>

<td colspan="3">

${data.mother_occupation||""}

</td>

</tr>

</table>

<div class="section">

Guardian Information

</div>

<table>

<tr>

<td width="25%"><b>Guardian</b></td>

<td>${data.guardian_name||""}</td>

<td width="25%"><b>Relation</b></td>

<td>${data.guardian_relation||""}</td>

</tr>

<tr>

<td><b>Guardian Mobile</b></td>

<td>${data.guardian_mobile||""}</td>

<td><b>Emergency</b></td>

<td>${data.emergency_contact||""}</td>

</tr>

</table>
<div class="section">

Address Information

</div>

<table>

<tr>

<td width="25%"><b>Village</b></td>

<td>${data.village||""}</td>

<td width="25%"><b>Post Office</b></td>

<td>${data.post_office||""}</td>

</tr>

<tr>

<td><b>Upazila</b></td>

<td>${data.upazila||""}</td>

<td><b>District</b></td>

<td>${data.district||""}</td>

</tr>

<tr>

<td><b>Present Address</b></td>

<td colspan="3">

${data.present_address||""}

</td>

</tr>

<tr>

<td><b>Permanent Address</b></td>

<td colspan="3">

${data.permanent_address||""}

</td>

</tr>

</table>

<div class="section">

Fee Information

</div>

<table>

<tr>

<td width="25%"><b>Admission Fee</b></td>

<td>৳ ${data.admission_fee||0}</td>

<td width="25%"><b>Monthly Fee</b></td>

<td>৳ ${data.monthly_fee||0}</td>

</tr>

</table>

<div class="mt-4 text-center">

<img
src="${qr}"
width="110"
height="110">

<p class="mt-2">

<b>${data.student_id}</b>

</p>

</div>

<div class="sign">

<div>

Student Signature

</div>

<div>

Guardian Signature

</div>

<div>

Principal Signature

</div>

</div>

<hr>

<div class="text-center">

<b>

Madrasa-E Nurul Quran

</b>

<br>

Admission Application Form

</div>

</div>

<script>

setTimeout(()=>{

window.print();

},500);

</script>

</body>

</html>

`);

win.document.close();

}catch(err){

console.error(err);

alert(err.message);

}

}

 
