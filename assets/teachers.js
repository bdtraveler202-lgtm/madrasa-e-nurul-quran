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
// ======================================
// ADD TEACHER FORM
// ======================================

document.addEventListener("click",function(e){

if(e.target.id!=="addTeacher") return;

document.getElementById("contentArea").innerHTML=`

<h2 class="mb-4">

👨‍🏫 Add Teacher

</h2>

<div class="card shadow">

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

<label>Status</label>

<select
id="status"
class="form-select">

<option>Active</option>

<option>Inactive</option>

</select>

</div>

<div class="col-md-12 mb-3">

<label>Photo</label>

<input
type="file"
id="teacher_photo"
class="form-control"
accept="image/*">

</div>

<div class="col-12">

<button
class="btn btn-success">

Save Teacher

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="loadTeacherPage()">

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
// SAVE TEACHER
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

document.addEventListener("submit",async function(e){

if(e.target.id!=="teacherForm") return;

e.preventDefault();

const btn=e.target.querySelector("button");

btn.disabled=true;
btn.innerText="Saving...";

try{

const photo=
document.getElementById("teacher_photo").files[0];

const photo_url=
await uploadTeacherPhoto(photo);

const {error}=await window.supabaseClient
.from("teachers")
.insert([{

name:document.getElementById("teacher_name").value,

designation:document.getElementById("designation").value,

mobile:document.getElementById("mobile").value,

status:document.getElementById("status").value,

photo_url

}]);

btn.disabled=false;
btn.innerText="Save Teacher";

if(error){

alert(error.message);

return;

}

alert("✅ Teacher Added Successfully");

loadTeacherPage();

}catch(err){

btn.disabled=false;
btn.innerText="Save Teacher";

alert(err.message);

}

});




