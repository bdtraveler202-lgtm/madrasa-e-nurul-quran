// ======================================
// STUDENT LIST
// ======================================

document.getElementById("menuStudents").addEventListener("click", async function(e){

e.preventDefault();

document.getElementById("contentArea").innerHTML=`

<h2 class="mb-4">📋 Student List</h2>

<div class="card shadow">

<div class="card-body">

<div class="row mb-3">

<div class="col-md-6">

<input
type="text"
id="searchStudent"
class="form-control"
placeholder="Search Student">

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

</div>

<div class="table-responsive">

<table class="table table-bordered table-hover">

<thead class="table-success">

<tr>

<th>ID</th>

<th>Name</th>

<th>Class</th>

<th>Mobile</th>

<th>Status</th>

<th width="180">

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

});
// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents(){

const table=document.getElementById("studentTable");

const { data,error }=
await window.supabaseClient
.from("students")
.select("*")
.order("created_at",{ascending:false});

if(error){

table.innerHTML=`

<tr>

<td colspan="6" class="text-danger text-center">

${error.message}

</td>

</tr>

`;

return;

}

table.innerHTML="";

if(data.length===0){

table.innerHTML=`

<tr>

<td colspan="6" class="text-center">

No Student Found

</td>

</tr>

`;

return;

}

data.forEach(student=>{

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
class="btn btn-primary btn-sm"
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
// ACTION BUTTONS
// ======================================

window.viewStudent=function(id){

alert("View Student ID : "+id);

}

window.editStudent=function(id){

alert("Edit Student ID : "+id);

}

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

} 



