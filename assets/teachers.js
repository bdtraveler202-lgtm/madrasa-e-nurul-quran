// ======================================
// TEACHER MANAGEMENT V1
// ======================================

let teachers=[];

document.addEventListener("click",function(e){

if(e.target.id==="menuTeachers"){

e.preventDefault();

loadTeacherPage();

}

});

function loadTeacherPage(){

document.getElementById("contentArea").innerHTML=`

<h2 class="mb-4">👨‍🏫 Teacher Management</h2>

<div class="card shadow">

<div class="card-body">

<div class="row mb-3">

<div class="col-md-6">

<input
type="text"
id="searchTeacher"
class="form-control"
placeholder="Search Teacher">

</div>

<div class="col-md-6 text-end">

<button
class="btn btn-success"
id="addTeacher">

➕ Add Teacher

</button>

</div>

</div>

<div class="table-responsive">

<table class="table table-bordered table-hover">

<thead class="table-success">

<tr>

<th>Photo</th>

<th>Name</th>

<th>Designation</th>

<th>Mobile</th>

<th>Status</th>

<th width="220">

Action

</th>

</tr>

</thead>

<tbody id="teacherTable">

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

loadTeachers();

}

async function loadTeachers(){

const table=document.getElementById("teacherTable");

const {data,error}=await window.supabaseClient
.from("teachers")
.select("*")
.order("created_at",{ascending:false});

if(error){

table.innerHTML=`<tr><td colspan="6">${error.message}</td></tr>`;

return;

}

teachers=data||[];

renderTeachers(teachers);

}

function renderTeachers(list){

const table=document.getElementById("teacherTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=`<tr><td colspan="6" class="text-center">No Teacher Found</td></tr>`;

return;

}

list.forEach(item=>{

table.innerHTML+=`

<tr>

<td>

<img
src="${item.photo_url||'https://placehold.co/70x70'}"
style="width:60px;height:60px;border-radius:50%;object-fit:cover;">

</td>

<td>${item.name||"-"}</td>

<td>${item.designation||"-"}</td>

<td>${item.mobile||"-"}</td>

<td>${item.status||"Active"}</td>

<td>

<button class="btn btn-primary btn-sm">

View

</button>

<button class="btn btn-warning btn-sm">

Edit

</button>

<button class="btn btn-danger btn-sm">

Delete

</button>

</td>

</tr>

`;

});

}
