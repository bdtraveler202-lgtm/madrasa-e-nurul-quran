// ======================================
// STUDENT MANAGEMENT V2
// PART 1
// ======================================

let students = [];

// ======================================
// OPEN STUDENT LIST
// ======================================

document.getElementById("menuStudents").addEventListener("click", function (e) {

e.preventDefault();

loadStudentPage();

});

// ======================================
// LOAD PAGE
// ======================================

function loadStudentPage(){

document.getElementById("contentArea").innerHTML=`

<h2 class="mb-4">

📋 Student List

</h2>

<div class="card shadow">

<div class="card-body">

<div class="row mb-3">

<div class="col-md-6">

<input
type="text"
id="searchStudent"
class="form-control"
placeholder="Search Name / ID / Mobile">

</div>

<div class="col-md-3">

<select
id="classFilter"
class="form-select">

<option value="">All Class</option>

<option>নূরানী</option>

<option>১ম শ্রেণি</option>

<option>২য় শ্রেণি</option>

<option>৩য় শ্রেণি</option>

<option>৪র্থ শ্রেণি</option>

<option>৫ম শ্রেণি</option>

<option>নাজেরা</option>

<option>হিফজ</option>

</select>

</div>

<div class="col-md-3 text-end">

<button
class="btn btn-success"
id="refreshStudents">

Refresh

</button>

</div>

</div>

<div class="table-responsive">

<table class="table table-bordered table-hover align-middle">

<thead class="table-success">

<tr>

<th>ID</th>

<th>Name</th>

<th>Class</th>

<th>Mobile</th>

<th>Status</th>

<th width="210">

Action

</th>

</tr>

</thead>

<tbody id="studentTable">

<tr>

<td colspan="6" class="text-center">

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
// LOAD DATA
// ======================================

async function loadStudents(){

const table =
document.getElementById("studentTable");

const { data,error } =
await window.supabaseClient
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

students=data || [];

renderStudents(students);

}

// ======================================
// RENDER TABLE
// ======================================

function renderStudents(list){

const table =
document.getElementById("studentTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=`

<tr>

<td colspan="6" class="text-center">

No Student Found

</td>

</tr>

`;

return;

}

list.forEach(student=>{

table.innerHTML+=`

<tr>

<td>${student.student_id||"-"}</td>

<td>${student.full_name||"-"}</td>

<td>${student.class||"-"}</td>

<td>${student.mobile||"-"}</td>

<td>

<span class="badge bg-success">

${student.status||"Pending"}

</span>

</td>

<td>

<button
class="btn btn-info btn-sm"
onclick="viewStudent(${student.id})">

View

</button>

<button
class="btn btn-warning btn-sm"
onclick="editStudent(${student.id})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteStudent(${student.id})">

Delete

</button>

</td>

</tr>

`;

});

} 
// ======================================
// STUDENT MANAGEMENT V2
// PART 2
// ======================================

// SEARCH

document.addEventListener("input",function(e){

if(e.target.id==="searchStudent"){

filterStudents();

}

});

// FILTER

document.addEventListener("change",function(e){

if(e.target.id==="classFilter"){

filterStudents();

}

});

// REFRESH

document.addEventListener("click",function(e){

if(e.target.id==="refreshStudents"){

loadStudents();

}

});

// FILTER FUNCTION

function filterStudents(){

const keyword=
(document.getElementById("searchStudent").value||"")
.toLowerCase();

const className=
document.getElementById("classFilter").value;

const filtered=
students.filter(student=>{

const matchSearch=

(student.full_name||"")
.toLowerCase()
.includes(keyword)

||

(student.student_id||"")
.toLowerCase()
.includes(keyword)

||

(student.mobile||"")
.toLowerCase()
.includes(keyword);

const matchClass=

className===""

||

student.class===className;

return matchSearch && matchClass;

});

renderStudents(filtered);

}

// ======================================
// VIEW
// ======================================

window.viewStudent=async function(id){

const {data,error}=await window.supabaseClient

.from("students")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

document.getElementById("contentArea").innerHTML=`

<div class="card shadow">

<div class="card-header bg-success text-white">

<h4>

Student Profile

</h4>

</div>

<div class="card-body">

<table class="table table-bordered">

<tr>

<th width="220">

Student ID

</th>

<td>${data.student_id||"-"}</td>

</tr>

<tr>

<th>Name</th>

<td>${data.full_name||"-"}</td>

</tr>

<tr>

<th>Father</th>

<td>${data.father_name||"-"}</td>

</tr>

<tr>

<th>Mother</th>

<td>${data.mother_name||"-"}</td>

</tr>

<tr>

<th>Class</th>

<td>${data.class||"-"}</td>

</tr>

<tr>

<th>Mobile</th>

<td>${data.mobile||"-"}</td>

</tr>

<tr>

<th>Gender</th>

<td>${data.gender||"-"}</td>

</tr>

<tr>

<th>Status</th>

<td>${data.status||"-"}</td>

</tr>

<tr>

<th>Address</th>

<td>${data.address||"-"}</td>

</tr>

</table>

<button
class="btn btn-secondary"
onclick="loadStudentPage()">

← Back

</button>

</div>

</div>

`;

};

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

alert("Student Deleted");

loadStudents();

};
// ======================================
// EDIT STUDENT
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

document.getElementById("contentArea").innerHTML=`

<h2 class="mb-4">

✏️ Edit Student

</h2>

<div class="card shadow">

<div class="card-body">

<form id="editStudentForm">

<input
type="hidden"
id="edit_id"
value="${data.id}">

<div class="row">

<div class="col-md-6 mb-3">

<label>Name</label>

<input
type="text"
id="edit_name"
class="form-control"
value="${data.full_name||""}">

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

<input
type="text"
id="edit_class"
class="form-control"
value="${data.class||""}">

</div>

<div class="col-md-6 mb-3">

<label>Status</label>

<select
id="edit_status"
class="form-select">

<option ${data.status==="Pending"?"selected":""}>Pending</option>

<option ${data.status==="Approved"?"selected":""}>Approved</option>

<option ${data.status==="Rejected"?"selected":""}>Rejected</option>

</select>

</div>

<div class="col-12">

<button
class="btn btn-success">

Update Student

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="loadStudentPage()">

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

document.addEventListener("submit", async function(e){

if(e.target.id !== "editStudentForm") return;

e.preventDefault();

const btn = e.target.querySelector("button");

btn.disabled = true;
btn.innerText = "Updating...";

const id = document.getElementById("edit_id").value;

const { error } =
await window.supabaseClient
.from("students")
.update({

full_name: document.getElementById("edit_name").value,

father_name: document.getElementById("edit_father").value,

mother_name: document.getElementById("edit_mother").value,

mobile: document.getElementById("edit_mobile").value,

class: document.getElementById("edit_class").value,

status: document.getElementById("edit_status").value

})
.eq("id", id);

btn.disabled = false;
btn.innerText = "Update Student";

if(error){

alert(error.message);

return;

}

alert("✅ Student Updated Successfully");

loadStudentPage();

});






