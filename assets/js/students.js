/* ==========================================
   Madrasa-E Nurul Quran
   Student Management System
   students.js (Final)
========================================== */

/* ==========================
   GLOBAL ELEMENTS
========================== */

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

const departmentSelect = document.getElementById("department");
const classSelect = document.getElementById("studentClass");

const searchInput = document.getElementById("searchStudent");
const searchButton = document.getElementById("searchBtn");

const departmentFilter = document.getElementById("departmentFilter");
const classFilter = document.getElementById("classFilter");
const statusFilter = document.getElementById("statusFilter");

/* ==========================
   CLASS DATA
========================== */

const CLASS_DATA = {

    Nurani: [
        "শিশু",
        "প্রথম",
        "দ্বিতীয়",
        "তৃতীয়",
        "চতুর্থ",
        "পঞ্চম"
    ],

    Nazera: [
        "১ম বর্ষ",
        "২য় বর্ষ",
        "৩য় বর্ষ",
        "৪র্থ বর্ষ",
        "সমাপনী"
    ],

    Hifz: [
        "প্রস্তুতি",
        "১ম বর্ষ",
        "২য় বর্ষ",
        "৩য় বর্ষ",
        "৪র্থ বর্ষ",
        "৫ম বর্ষ",
        "সম্পন্ন"
    ]

};

/* ==========================
   SESSION
========================== */

async function checkSession() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {

        window.location.href = "login.html";
        return false;

    }

    return true;

}

/* ==========================
   LOAD CLASS
========================== */

function loadDepartmentClasses(selectBox, department) {

    selectBox.innerHTML = "";

    const first = document.createElement("option");

    first.value = "";
    first.textContent = "Select Class";

    selectBox.appendChild(first);

    if (!CLASS_DATA[department]) return;

    CLASS_DATA[department].forEach(item => {

        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        selectBox.appendChild(option);

    });

}

/* Registration Form */

if (departmentSelect) {

    departmentSelect.addEventListener("change", () => {

        loadDepartmentClasses(
            classSelect,
            departmentSelect.value
        );

    });

}

/* Search Filter */

if (departmentFilter) {

    departmentFilter.addEventListener("change", () => {

        loadDepartmentClasses(
            classFilter,
            departmentFilter.value
        );

    });

}

/* ==========================
   AUTO STUDENT ID
========================== */

async function generateStudentID() {

    const year = new Date().getFullYear();

    const { count } = await supabase

        .from("students")

        .select("*", {

            count: "exact",
            head: true

        });

    const next = String(
        (count || 0) + 1
    ).padStart(6, "0");

    const studentID = `MDR-${year}-${next}`;

    const idBox =
        document.getElementById("studentID");

    if (idBox) {

        idBox.value = studentID;

    }

    return studentID;

}

/* ==========================
   PHOTO UPLOAD
========================== */

async function uploadStudentPhoto(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" + file.name;

    const { error } =
        await supabase.storage

        .from("students")

        .upload(fileName, file);

    if (error) throw error;

    const { data } =
        supabase.storage

        .from("students")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

/* ==========================
   INIT
========================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const ok = await checkSession();

        if (!ok) return;

        await generateStudentID();

    }
); 
/* ==========================================
   SAVE STUDENT
========================================== */

studentForm?.addEventListener("submit", saveStudent);

async function saveStudent(e){

e.preventDefault();

try{

const studentID = await generateStudentID();

const imageFile =
document.getElementById("studentPhoto").files[0];

const photo =
await uploadStudentPhoto(imageFile);

const student = {

student_id:studentID,

admission_date:document.getElementById("admissionDate").value,

department:document.getElementById("department").value,

class_name:document.getElementById("studentClass").value,

section:document.getElementById("section").value,

roll:document.getElementById("roll").value,

session:document.getElementById("session").value,

status:document.getElementById("studentStatus").value,

student_name_bn:document.getElementById("studentNameBn").value,

student_name_en:document.getElementById("studentNameEn").value,

student_name_ar:document.getElementById("studentNameAr").value,

dob:document.getElementById("dob").value,

gender:document.getElementById("gender").value,

blood_group:document.getElementById("bloodGroup").value,

religion:document.getElementById("religion").value,

birth_certificate:document.getElementById("birthCertificate").value,

nid:document.getElementById("nid").value,

photo_url:photo,

father_name:document.getElementById("fatherName").value,

father_occupation:document.getElementById("fatherOccupation").value,

father_mobile:document.getElementById("fatherMobile").value,

mother_name:document.getElementById("motherName").value,

mother_occupation:document.getElementById("motherOccupation").value,

mother_mobile:document.getElementById("motherMobile").value,

guardian_name:document.getElementById("guardianName").value,

guardian_relation:document.getElementById("guardianRelation").value,

guardian_mobile:document.getElementById("guardianMobile").value,

present_address:document.getElementById("presentAddress").value,

permanent_address:document.getElementById("permanentAddress").value,

village:document.getElementById("village").value,

post_office:document.getElementById("postOffice").value,

upazila:document.getElementById("upazila").value,

district:document.getElementById("district").value,

previous_institute:document.getElementById("previousInstitute").value,

admission_fee:Number(document.getElementById("admissionFee").value||0),

monthly_fee:Number(document.getElementById("monthlyFee").value||0),

scholarship:Number(document.getElementById("scholarship").value||0),

emergency_contact:document.getElementById("emergencyContact").value,

sms_number:document.getElementById("smsNumber").value,

email:document.getElementById("studentEmail").value,

remarks:document.getElementById("remarks").value

};

if(editingStudentId){

const ok = await updateStudent(student);

if(ok){

bootstrap.Modal
.getInstance(document.getElementById("studentModal"))
.hide();

studentForm.reset();

}

return;

}

const {error}=await supabase

.from("students")

.insert(student);

if(error) throw error;
alert("Student Registered Successfully");

studentForm.reset();

bootstrap.Modal
.getInstance(document.getElementById("studentModal"))
.hide();

await generateStudentID();

loadStudents();

}catch(err){

alert(err.message);

}

}
/* ==========================================
   LOAD STUDENTS
========================================== */

async function loadStudents() {

const { data, error } = await supabase

.from("students")

.select("*")

.order("created_at",{ascending:false});

if(error){

console.error(error);

return;

}

studentTable.innerHTML="";

data.forEach(student=>{

studentTable.innerHTML+=`

<tr>

<td>${student.student_id}</td>

<td>

<img
src="${student.photo_url || 'assets/img/default-user.png'}"
class="student-photo">

</td>

<td>${student.student_name_bn || student.student_name_en || ""}</td>

<td>${student.department || ""}</td>

<td>${student.class_name || ""}</td>

<td>${student.roll || ""}</td>

<td>${student.father_mobile || student.guardian_mobile || ""}</td>

<td>

<span class="${
student.status==="Active"
?
"badge-active"
:
"badge-inactive"
}">

${student.status}

</span>

</td>

<td>

<button
class="action-btn view-btn"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="action-btn edit-btn"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete-btn"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/* ==========================================
SEARCH
========================================== */

searchButton?.addEventListener("click",searchStudents);

async function searchStudents(){

let query=supabase.from("students").select("*");

if(searchInput.value.trim()){

const k=searchInput.value.trim();

query=query.or(

`student_id.ilike.%${k}%,
student_name_bn.ilike.%${k}%,
student_name_en.ilike.%${k}%,
father_mobile.ilike.%${k}%,
guardian_mobile.ilike.%${k}%`

);

}

if(departmentFilter.value){

query=query.eq("department",departmentFilter.value);

}

if(classFilter.value){

query=query.eq("class_name",classFilter.value);

}

if(statusFilter.value){

query=query.eq("status",statusFilter.value);

}

const {data,error}=await query.order("created_at",{ascending:false});

if(error){

alert(error.message);

return;

}

studentTable.innerHTML="";

data.forEach(student=>{

studentTable.innerHTML+=`

<tr>

<td>${student.student_id}</td>

<td>

<img
src="${student.photo_url || 'assets/img/default-user.png'}"
class="student-photo">

</td>

<td>${student.student_name_bn || ""}</td>

<td>${student.department || ""}</td>

<td>${student.class_name || ""}</td>

<td>${student.roll || ""}</td>

<td>${student.guardian_mobile || ""}</td>

<td>${student.status}</td>

<td>

<button
class="action-btn view-btn"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="action-btn edit-btn"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete-btn"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/* ==========================================
DELETE
========================================== */

async function deleteStudent(id){

if(!confirm("Delete this student?")) return;

const {error}=await supabase

.from("students")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadStudents();

}

/* ==========================================
PROFILE
========================================== */

function viewStudent(studentID){

location.href=

"student-profile.html?id="+

encodeURIComponent(studentID);

}

/* ==========================================
INIT TABLE
========================================== */

document.addEventListener(

"DOMContentLoaded",

loadStudents

);
/* ==========================================
   EDIT + UPDATE + PRINT
========================================== */

let editingStudentId = null;

/* ---------- EDIT ---------- */

async function editStudent(id){

const {data,error}=await supabase

.from("students")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

editingStudentId=id;

document.getElementById("studentID").value=data.student_id||"";
document.getElementById("admissionDate").value=data.admission_date||"";

document.getElementById("department").value=data.department||"";
loadDepartmentClasses(
document.getElementById("studentClass"),
data.department
);

document.getElementById("studentClass").value=data.class_name||"";

document.getElementById("section").value=data.section||"";
document.getElementById("roll").value=data.roll||"";
document.getElementById("session").value=data.session||"";
document.getElementById("studentStatus").value=data.status||"Active";

document.getElementById("studentNameBn").value=data.student_name_bn||"";
document.getElementById("studentNameEn").value=data.student_name_en||"";
document.getElementById("studentNameAr").value=data.student_name_ar||"";

document.getElementById("dob").value=data.dob||"";
document.getElementById("gender").value=data.gender||"";
document.getElementById("bloodGroup").value=data.blood_group||"";
document.getElementById("religion").value=data.religion||"";

document.getElementById("birthCertificate").value=data.birth_certificate||"";
document.getElementById("nid").value=data.nid||"";

document.getElementById("fatherName").value=data.father_name||"";
document.getElementById("fatherOccupation").value=data.father_occupation||"";
document.getElementById("fatherMobile").value=data.father_mobile||"";

document.getElementById("motherName").value=data.mother_name||"";
document.getElementById("motherOccupation").value=data.mother_occupation||"";
document.getElementById("motherMobile").value=data.mother_mobile||"";

document.getElementById("guardianName").value=data.guardian_name||"";
document.getElementById("guardianRelation").value=data.guardian_relation||"";
document.getElementById("guardianMobile").value=data.guardian_mobile||"";

document.getElementById("presentAddress").value=data.present_address||"";
document.getElementById("permanentAddress").value=data.permanent_address||"";

document.getElementById("village").value=data.village||"";
document.getElementById("postOffice").value=data.post_office||"";
document.getElementById("upazila").value=data.upazila||"";
document.getElementById("district").value=data.district||"";

document.getElementById("previousInstitute").value=data.previous_institute||"";

document.getElementById("admissionFee").value=data.admission_fee||0;
document.getElementById("monthlyFee").value=data.monthly_fee||0;
document.getElementById("scholarship").value=data.scholarship||0;

document.getElementById("emergencyContact").value=data.emergency_contact||"";
document.getElementById("smsNumber").value=data.sms_number||"";
document.getElementById("studentEmail").value=data.email||"";
document.getElementById("remarks").value=data.remarks||"";

new bootstrap.Modal(
document.getElementById("studentModal")
).show();

}

/* ---------- UPDATE ---------- */

async function updateStudent(values){

const {error}=await supabase

.from("students")

.update(values)

.eq("id",editingStudentId);

if(error){

alert(error.message);

return false;

}

editingStudentId=null;

loadStudents();

alert("Student Updated Successfully");

return true;

}

/* ---------- PRINT ---------- */

function printIDCard(studentID){

window.open(

"id-card.html?id="+
encodeURIComponent(studentID),

"_blank"

);

}

function printAdmitCard(studentID){

window.open(

"admit-card.html?id="+
encodeURIComponent(studentID),

"_blank"

);

}

/* ---------- QR ---------- */

function generateQR(studentID){

return

"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="

+encodeURIComponent(studentID);

}



