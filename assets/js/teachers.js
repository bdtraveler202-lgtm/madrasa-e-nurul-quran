// ======================================
// TEACHER MANAGEMENT V1
// assets/js/teachers.js
// ======================================

let teachers=[];

// ======================================
// MENU
// ======================================

document.addEventListener("click",function(e){

if(e.target.closest("#teacherMenu")){

e.preventDefault();

teacherPage();

}

});

// ======================================
// PAGE
// ======================================

function teacherPage(){

document.getElementById("pageTitle").innerText="Teacher Management";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Teacher List</h4>

<button
class="btn-green"
id="addTeacherBtn">

Add Teacher

</button>

</div>

<div class="table-responsive">

<table class="table">

<thead>

<tr>

<th>Photo</th>

<th>Name</th>

<th>Designation</th>

<th>Mobile</th>

<th>Email</th>

<th>Status</th>

<th width="220">

Action

</th>

</tr>

</thead>

<tbody id="teacherTable">

<tr>

<td colspan="7">

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

// ======================================
// LOAD
// ======================================

async function loadTeachers(){

const table=document.getElementById("teacherTable");

const {data,error}=await window.supabaseClient

.from("teachers")

.select("*")

.order("created_at",{ascending:false});

if(error){

table.innerHTML=`

<tr>

<td colspan="7">

${error.message}

</td>

</tr>

`;

return;

}

teachers=data||[];

renderTeachers(teachers);

}

// ======================================
// RENDER
// ======================================

function renderTeachers(list){

const table=document.getElementById("teacherTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=`

<tr>

<td colspan="7">

No Teacher Found

</td>

</tr>

`;

return;

}

list.forEach(item=>{

table.innerHTML+=`

<tr>

<td>

<img
src="${item.photo_url||'assets/img/default-user.png'}"
style="width:55px;height:55px;border-radius:50%;object-fit:cover;">

</td>

<td>${item.name||""}</td>

<td>${item.designation||""}</td>

<td>${item.mobile||""}</td>

<td>${item.email||""}</td>

<td>

<span class="badge bg-success">

${item.status||"Active"}

</span>

</td>

<td>

<button
class="btn btn-sm btn-primary">

View

</button>

<button
class="btn btn-sm btn-warning">

Edit

</button>

<button
class="btn btn-sm btn-danger">

Delete

</button>

</td>

</tr>

`;

});

}
// ======================================
// ADD TEACHER FORM
// assets/js/teachers.js
// নিচে Paste করো
// ======================================

document.addEventListener("click",function(e){

if(!e.target.closest("#addTeacherBtn")) return;

document.getElementById("pageTitle").innerText="Add Teacher";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="teacherForm">

<div class="row">

<div class="col-md-6 mb-3">

<label>Teacher Name</label>

<input
type="text"
id="teacher_name"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>Designation</label>

<input
type="text"
id="designation"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>Mobile</label>

<input
type="text"
id="mobile"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Email</label>

<input
type="email"
id="email"
class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Status</label>

<select
id="status"
class="form-select">

<option>Active</option>

<option>Inactive</option>

</select>

</div>

<div class="col-md-6 mb-3">

<label>Photo</label>

<input
type="file"
id="photo"
class="form-control"
accept="image/*">

</div>

<div class="col-12">

<button
type="submit"
class="btn-green">

Save Teacher

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="teacherPage()">

Cancel

</button>

</div>

</div>

</form>

</div>

</div>

`;

});

// ======================================
// PHOTO UPLOAD
// ======================================

async function uploadTeacherPhoto(file){

if(!file) return "";

const fileName=
Date.now()+"_"+file.name.replace(/\s+/g,"_");

const {error}=await window.supabaseClient.storage

.from("teacher-images")

.upload(fileName,file,{upsert:true});

if(error) throw error;

const {data}=window.supabaseClient.storage

.from("teacher-images")

.getPublicUrl(fileName);

return data.publicUrl;

}

// ======================================
// SAVE TEACHER
// ======================================

document.addEventListener("submit",async function(e){

if(e.target.id!=="teacherForm") return;

e.preventDefault();

const btn=e.target.querySelector("button");

btn.disabled=true;

btn.innerHTML="Saving...";

try{

const photo=
document.getElementById("photo").files[0];

const photo_url=
await uploadTeacherPhoto(photo);

const {error}=await window.supabaseClient

.from("teachers")

.insert([{

name:document.getElementById("teacher_name").value,

designation:document.getElementById("designation").value,

mobile:document.getElementById("mobile").value,

email:document.getElementById("email").value,

status:document.getElementById("status").value,

photo_url

}]);

btn.disabled=false;

btn.innerHTML="Save Teacher";

if(error){

alert(error.message);

return;

}

alert("Teacher Added Successfully");

teacherPage();

}catch(err){

btn.disabled=false;

btn.innerHTML="Save Teacher";

alert(err.message);

}

});

