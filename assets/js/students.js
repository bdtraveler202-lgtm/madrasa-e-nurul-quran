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

function printApplicationForm(studentID){

window.open(
`javascript:alert('Application Form Print will be added in Part 5\\nStudent ID: ${studentID}')`
);

}

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
