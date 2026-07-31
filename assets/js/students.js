/* ==========================================
   MADRASA ERP
   STUDENTS.JS
   PROFESSIONAL VERSION
========================================== */

/* ==========================
   SUPABASE
========================== */

const db = window.supabaseClient;

/* ==========================
   GLOBAL
========================== */

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");

const departmentSelect =
document.getElementById("department");

const classSelect =
document.getElementById("studentClass");

const searchInput =
document.getElementById("searchStudent");

const searchButton =
document.getElementById("searchBtn");

const departmentFilter =
document.getElementById("departmentFilter");

const classFilter =
document.getElementById("classFilter");

const statusFilter =
document.getElementById("statusFilter");

let editingStudentId = null;

/* ==========================
   CLASS DATA
========================== */

const CLASS_DATA = {

Nurani:[

"শিশু",
"প্রথম",
"দ্বিতীয়",
"তৃতীয়",
"চতুর্থ",
"পঞ্চম"

],

Nazera:[

"১ম বর্ষ",
"২য় বর্ষ",
"৩য় বর্ষ",
"৪র্থ বর্ষ",
"সমাপনী"

],

Hifz:[

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

async function checkSession(){

const {

data:{session}

}

=

await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

/* ==========================
LOAD CLASS
========================== */

function loadDepartmentClasses(box,dept){

box.innerHTML="";

const first=document.createElement("option");

first.value="";

first.textContent="Select Class";

box.appendChild(first);

if(!CLASS_DATA[dept]) return;

CLASS_DATA[dept].forEach(cls=>{

const option=document.createElement("option");

option.value=cls;

option.textContent=cls;

box.appendChild(option);

});

}

departmentSelect?.addEventListener(

"change",

()=>{

loadDepartmentClasses(

classSelect,

departmentSelect.value

);

}

);

departmentFilter?.addEventListener(

"change",

()=>{

loadDepartmentClasses(

classFilter,

departmentFilter.value

);

}

);

/* ==========================
AUTO ID
========================== */

async function generateStudentID(){

const year=new Date().getFullYear();

const {count,error}=await db

.from("students")

.select("*",{

count:"exact",

head:true

});

if(error){

console.error(error);

return "";

}

const serial=

String((count||0)+1)

.padStart(6,"0");

const id=

`MDR-${year}-${serial}`;

const box=

document.getElementById("studentID");

if(box){

box.value=id;

}

return id;

} 
/* ==========================
PHOTO UPLOAD
========================== */

async function uploadStudentPhoto(file){

if(!file) return "";

const fileName=

Date.now()+"_"+file.name;

const {error}=await db.storage

.from("students")

.upload(fileName,file);

if(error) throw error;

const {data}=db.storage

.from("students")

.getPublicUrl(fileName);

return data.publicUrl;

}

/* ==========================
SAVE STUDENT
========================== */

studentForm?.addEventListener(

"submit",

saveStudent

);

async function saveStudent(e){

e.preventDefault();

try{

const btn=

studentForm.querySelector(

'button[type="submit"]'

);

const oldText=btn.innerHTML;

btn.disabled=true;

btn.innerHTML="Saving...";

let studentID=

document.getElementById("studentID").value;

if(!studentID){

studentID=

await generateStudentID();

}

let photo="";

const file=

document.getElementById("studentPhoto")?.files[0];

if(file){

photo=

await uploadStudentPhoto(file);

}

const student={

student_id:studentID,

admission_date:

document.getElementById("admissionDate").value,

department:

document.getElementById("department").value,

class_name:

document.getElementById("studentClass").value,

section:

document.getElementById("section").value,

roll:

document.getElementById("roll").value,

session:

document.getElementById("session").value,

status:

document.getElementById("studentStatus").value,

student_name_bn:

document.getElementById("studentNameBn").value,

student_name_en:

document.getElementById("studentNameEn").value,

student_name_ar:

document.getElementById("studentNameAr").value,

dob:

document.getElementById("dob").value,

gender:

document.getElementById("gender").value,

blood_group:

document.getElementById("bloodGroup").value,

religion:

document.getElementById("religion").value,

birth_certificate:

document.getElementById("birthCertificate").value,

nid:

document.getElementById("nid").value,

photo_url:photo,

father_name:

document.getElementById("fatherName").value,

father_occupation:

document.getElementById("fatherOccupation").value,

father_mobile:

document.getElementById("fatherMobile").value,

mother_name:

document.getElementById("motherName").value,

mother_occupation:

document.getElementById("motherOccupation").value,

mother_mobile:

document.getElementById("motherMobile").value,

guardian_name:

document.getElementById("guardianName").value,

guardian_relation:

document.getElementById("guardianRelation").value,

guardian_mobile:

document.getElementById("guardianMobile").value,

present_address:

document.getElementById("presentAddress").value,

permanent_address:

document.getElementById("permanentAddress").value,

village:

document.getElementById("village").value,

post_office:

document.getElementById("postOffice").value,

upazila:

document.getElementById("upazila").value,

district:

document.getElementById("district").value,

previous_institute:

document.getElementById("previousInstitute").value,

admission_fee:Number(

document.getElementById("admissionFee").value||0

),

monthly_fee:Number(

document.getElementById("monthlyFee").value||0

),

scholarship:Number(

document.getElementById("scholarship").value||0

),

emergency_contact:

document.getElementById("emergencyContact").value,

sms_number:

document.getElementById("smsNumber").value,

email:

document.getElementById("studentEmail").value,

remarks:

document.getElementById("remarks").value

};

if(editingStudentId){

const {error}=await db

.from("students")

.update(student)

.eq("id",editingStudentId);

if(error) throw error;

editingStudentId=null;

alert("Student Updated Successfully");

}else{

const {error}=await db

.from("students")

.insert(student);

if(error) throw error;

alert("Student Registered Successfully");

}

studentForm.reset();

await generateStudentID();

await loadStudents();

bootstrap.Modal

.getInstance(

document.getElementById("studentModal")

)?.hide();

btn.disabled=false;

btn.innerHTML=oldText;

}catch(err){

alert(err.message);

console.error(err);

}

}
/* ==========================
   LOAD STUDENTS
========================== */

async function loadStudents() {

    try {

        let query = db
            .from("students")
            .select("*")
            .order("created_at", { ascending: false });

        if (departmentFilter?.value) {
            query = query.eq("department", departmentFilter.value);
        }

        if (classFilter?.value) {
            query = query.eq("class_name", classFilter.value);
        }

        if (statusFilter?.value) {
            query = query.eq("status", statusFilter.value);
        }

        if (searchInput?.value.trim()) {

            const k = searchInput.value.trim();

            query = query.or(
                `student_id.ilike.%${k}%,
                student_name_bn.ilike.%${k}%,
                student_name_en.ilike.%${k}%,
                father_mobile.ilike.%${k}%,
                guardian_mobile.ilike.%${k}%`
            );

        }

        const { data, error } = await query;

        if (error) throw error;

        studentTable.innerHTML = "";

        if (!data.length) {

            studentTable.innerHTML = `

<tr>

<td colspan="9" class="text-center">

No Student Found

</td>

</tr>

`;

            return;

        }

        data.forEach(student => {

            studentTable.innerHTML += `

<tr>

<td>${student.student_id}</td>

<td>

<img
src="${student.photo_url || "assets/img/default-user.png"}"
class="student-photo">

</td>

<td>${student.student_name_bn || student.student_name_en || ""}</td>

<td>${student.department || ""}</td>

<td>${student.class_name || ""}</td>

<td>${student.roll || ""}</td>

<td>${student.guardian_mobile || student.father_mobile || ""}</td>

<td>

<span class="badge ${student.status === "Active" ? "bg-success" : "bg-danger"}">

${student.status}

</span>

</td>

<td>

<button
class="btn btn-sm btn-info"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="btn btn-sm btn-warning"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

<button
class="btn btn-sm btn-success"
onclick="printIDCard('${student.student_id}')">

<i class="fa-solid fa-id-card"></i>

</button>

</td>

</tr>

`;

        });

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

/* ==========================
SEARCH
========================== */

searchButton?.addEventListener(
    "click",
    loadStudents
);

searchInput?.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {

            e.preventDefault();

            loadStudents();

        }

    }
);

departmentFilter?.addEventListener(
    "change",
    loadStudents
);

classFilter?.addEventListener(
    "change",
    loadStudents
);

statusFilter?.addEventListener(
    "change",
    loadStudents
);

/* ==========================
DELETE
========================== */

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

await loadStudents();

}

/* ==========================
VIEW PROFILE
========================== */

function viewStudent(studentID){

location.href=

"student-profile.html?id="+

encodeURIComponent(studentID);

}

/* ==========================
PRINT
========================== */

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

/* ==========================
INIT
========================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

    await generateStudentID();

    await loadStudents();

});
/* ==========================
   EDIT STUDENT
========================== */

async function editStudent(id) {

    try {

        const { data, error } = await db
            .from("students")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;

        editingStudentId = id;

        const set = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value ?? "";
        };

        set("studentID", data.student_id);
        set("admissionDate", data.admission_date);
        set("department", data.department);

        loadDepartmentClasses(
            document.getElementById("studentClass"),
            data.department
        );

        set("studentClass", data.class_name);
        set("section", data.section);
        set("roll", data.roll);
        set("session", data.session);
        set("studentStatus", data.status);

        set("studentNameBn", data.student_name_bn);
        set("studentNameEn", data.student_name_en);
        set("studentNameAr", data.student_name_ar);

        set("dob", data.dob);
        set("gender", data.gender);
        set("bloodGroup", data.blood_group);
        set("religion", data.religion);

        set("birthCertificate", data.birth_certificate);
        set("nid", data.nid);

        set("fatherName", data.father_name);
        set("fatherOccupation", data.father_occupation);
        set("fatherMobile", data.father_mobile);

        set("motherName", data.mother_name);
        set("motherOccupation", data.mother_occupation);
        set("motherMobile", data.mother_mobile);

        set("guardianName", data.guardian_name);
        set("guardianRelation", data.guardian_relation);
        set("guardianMobile", data.guardian_mobile);

        set("presentAddress", data.present_address);
        set("permanentAddress", data.permanent_address);

        set("village", data.village);
        set("postOffice", data.post_office);
        set("upazila", data.upazila);
        set("district", data.district);

        set("previousInstitute", data.previous_institute);

        set("admissionFee", data.admission_fee);
        set("monthlyFee", data.monthly_fee);
        set("scholarship", data.scholarship);

        set("emergencyContact", data.emergency_contact);
        set("smsNumber", data.sms_number);
        set("studentEmail", data.email);
        set("remarks", data.remarks);

        new bootstrap.Modal(
            document.getElementById("studentModal")
        ).show();

    } catch (err) {

        console.error(err);
        alert(err.message);

    }

}

/* ==========================
QR CODE URL
========================== */

function generateQR(studentID) {

    return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(studentID);

}

/* ==========================
RESET FORM
========================== */

function resetStudentForm() {

    editingStudentId = null;

    studentForm?.reset();

    generateStudentID();

}

/* ==========================
EXPORT
========================== */

window.loadStudents = loadStudents;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.viewStudent = viewStudent;
window.printIDCard = printIDCard;
window.printAdmitCard = printAdmitCard;

