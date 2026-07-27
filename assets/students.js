// ======================================
// STUDENT MODULE V1
// assets/js/students.js
// ======================================

let students=[];

// ===============================
// MENU
// ===============================

document.addEventListener("click",function(e){

if(e.target.closest("#studentAdmissionMenu")){

e.preventDefault();

studentAdmissionPage();

}

if(e.target.closest("#studentListMenu")){

e.preventDefault();

studentListPage();

}

});

// ===============================
// ADMISSION PAGE
// ===============================

function studentAdmissionPage(){

document.getElementById("pageTitle").innerText="Student Admission";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="studentForm">

<div class="row">

<div class="col-md-6 mb-3">

<label>Student Name</label>

<input
type="text"
id="full_name"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>Father Name</label>

<input
type="text"
id="father_name"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Mother Name</label>

<input
type="text"
id="mother_name"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Mobile</label>

<input
type="text"
id="mobile"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Class</label>

<select
id="student_class"
class="form-select">

<option>নূরানী</option>
<option>নাজেরা</option>
<option>হিফজ</option>
<option>১ম শ্রেণি</option>
<option>২য় শ্রেণি</option>
<option>৩য় শ্রেণি</option>
<option>৪র্থ শ্রেণি</option>
<option>৫ম শ্রেণি</option>

</select>

</div>

<div class="col-md-6 mb-3">

<label>Gender</label>

<select
id="gender"
class="form-select">

<option>Male</option>
<option>Female</option>

</select>

</div>

<div class="col-md-6 mb-3">

<label>Date of Birth</label>

<input
type="date"
id="dob"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Admission Date</label>

<input
type="date"
id="admission_date"
class="form-control">

</div>

<div class="col-12 mb-3">

<label>Address</label>

<textarea
id="address"
class="form-control"></textarea>

</div>

<div class="col-12">

<button
class="btn-green"
type="submit">

Save Student

</button>

</div>

</div>

</form>

</div>

</div>

`;

}

// ===============================
// SAVE STUDENT
// ===============================

document.addEventListener("submit",async function(e){

if(e.target.id!=="studentForm") return;

e.preventDefault();

const btn=e.target.querySelector("button");

btn.disabled=true;

btn.innerHTML="Saving...";

const { error }=
await window.supabaseClient
.from("students")
.insert([{

full_name:document.getElementById("full_name").value,

father_name:document.getElementById("father_name").value,

mother_name:document.getElementById("mother_name").value,

mobile:document.getElementById("mobile").value,

class:document.getElementById("student_class").value,

gender:document.getElementById("gender").value,

dob:document.getElementById("dob").value,

admission_date:document.getElementById("admission_date").value,

address:document.getElementById("address").value,

status:"Active"

}]);

btn.disabled=false;

btn.innerHTML="Save Student";

if(error){

alert(error.message);

return;

}

alert("Student Saved Successfully");

studentAdmissionPage();

});
// ======================================
// STUDENT LIST
// assets/js/students.js
// নিচে Paste করো
// ======================================

function studentListPage(){

document.getElementById("pageTitle").innerText="Student List";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<div class="row mb-3">

<div class="col-md-5">

<input
type="text"
id="studentSearch"
class="form-control"
placeholder="Search Student...">

</div>

<div class="col-md-3">

<select
id="studentClassFilter"
class="form-select">

<option value="">All Class</option>

<option>নূরানী</option>
<option>নাজেরা</option>
<option>হিফজ</option>
<option>১ম শ্রেণি</option>
<option>২য় শ্রেণি</option>
<option>৩য় শ্রেণি</option>
<option>৪র্থ শ্রেণি</option>
<option>৫ম শ্রেণি</option>

</select>

</div>

<div class="col-md-4 text-end">

<button
class="btn-green"
onclick="studentAdmissionPage()">

Add Student

</button>

</div>

</div>

<div class="table-responsive">

<table class="table">

<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Class</th>

<th>Mobile</th>

<th>Status</th>

<th width="230">

Action

</th>

</tr>

</thead>

<tbody id="studentTable">

<tr>

<td colspan="6">

Loading...

</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

`;

loadStudents();

}

// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents(){

const table=document.getElementById("studentTable");

const {data,error}=await window.supabaseClient

.from("students")

.select("*")

.order("created_at",{ascending:false});

if(error){

table.innerHTML=`
<tr>
<td colspan="6">
${error.message}
</td>
</tr>
`;

return;

}

students=data||[];

renderStudents(students);

}

// ======================================
// RENDER TABLE
// ======================================

function renderStudents(list){

const table=document.getElementById("studentTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=`
<tr>
<td colspan="6">
No Student Found
</td>
</tr>
`;

return;

}

list.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.student_id||item.id}</td>

<td>${item.full_name}</td>

<td>${item.class}</td>

<td>${item.mobile}</td>

<td>

<span class="badge bg-success">

${item.status}

</span>

</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="viewStudent(${item.id})">

View

</button>

<button
class="btn btn-sm btn-warning"
onclick="editStudent(${item.id})">

Edit

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteStudent(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

}

// ======================================
// VIEW
// ======================================

window.viewStudent=function(id){

const student=
students.find(x=>x.id===id);

if(!student) return;

alert(

"Name : "+student.full_name+

"\nFather : "+student.father_name+

"\nMobile : "+student.mobile+

"\nClass : "+student.class

);

}

// ======================================
// DELETE
// ======================================

window.deleteStudent=async function(id){

if(!confirm("Delete Student?")) return;

const {error}=await window.supabaseClient

.from("students")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadStudents();

}

// ======================================
// EDIT
// ======================================

window.editStudent=function(id){

alert("Edit Module Next Step");

} 
// ======================================
// EDIT STUDENT
// assets/js/students.js
// নিচে Paste করো
// ======================================

window.editStudent = async function(id){

const { data,error } =
await window.supabaseClient
.from("students")
.select("*")
.eq("id",id)
.single();

if(error){

alert(error.message);

return;

}

document.getElementById("pageTitle").innerText="Edit Student";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="updateStudentForm">

<input
type="hidden"
id="edit_id"
value="${data.id}">

<div class="row">

<div class="col-md-6 mb-3">

<label>Student Name</label>

<input
type="text"
id="edit_name"
class="form-control"
value="${data.full_name||""}"
required>

</div>

<div class="col-md-6 mb-3">

<label>Father Name</label>

<input
type="text"
id="edit_father"
class="form-control"
value="${data.father_name||""}">

</div>

<div class="col-md-6 mb-3">

<label>Mother Name</label>

<input
type="text"
id="edit_mother"
class="form-control"
value="${data.mother_name||""}">

</div>

<div class="col-md-6 mb-3">

<label>Mobile</label>

<input
type="text"
id="edit_mobile"
class="form-control"
value="${data.mobile||""}">

</div>

<div class="col-md-6 mb-3">

<label>Class</label>

<select
id="edit_class"
class="form-select">

<option ${data.class=="নূরানী"?"selected":""}>নূরানী</option>

<option ${data.class=="নাজেরা"?"selected":""}>নাজেরা</option>

<option ${data.class=="হিফজ"?"selected":""}>হিফজ</option>

<option ${data.class=="১ম শ্রেণি"?"selected":""}>১ম শ্রেণি</option>

<option ${data.class=="২য় শ্রেণি"?"selected":""}>২য় শ্রেণি</option>

<option ${data.class=="৩য় শ্রেণি"?"selected":""}>৩য় শ্রেণি</option>

<option ${data.class=="৪র্থ শ্রেণি"?"selected":""}>৪র্থ শ্রেণি</option>

<option ${data.class=="৫ম শ্রেণি"?"selected":""}>৫ম শ্রেণি</option>

</select>

</div>

<div class="col-md-6 mb-3">

<label>Status</label>

<select
id="edit_status"
class="form-select">

<option ${data.status=="Active"?"selected":""}>Active</option>

<option ${data.status=="Inactive"?"selected":""}>Inactive</option>

</select>

</div>

<div class="col-12">

<button
class="btn-green"
type="submit">

Update Student

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="studentListPage()">

Cancel

</button>

</div>

</div>

</form>

</div>

</div>

`;

};

// ======================================
// UPDATE STUDENT
// ======================================

document.addEventListener("submit",async function(e){

if(e.target.id!=="updateStudentForm") return;

e.preventDefault();

const btn=e.target.querySelector("button");

btn.disabled=true;

btn.innerHTML="Updating...";

const { error }=
await window.supabaseClient
.from("students")
.update({

full_name:document.getElementById("edit_name").value,

father_name:document.getElementById("edit_father").value,

mother_name:document.getElementById("edit_mother").value,

mobile:document.getElementById("edit_mobile").value,

class:document.getElementById("edit_class").value,

status:document.getElementById("edit_status").value

})
.eq("id",document.getElementById("edit_id").value);

btn.disabled=false;

btn.innerHTML="Update Student";

if(error){

alert(error.message);

return;

}

alert("Student Updated Successfully");

studentListPage();

});
