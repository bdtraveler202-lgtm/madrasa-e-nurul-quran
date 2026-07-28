// ======================================
// NOTICE MANAGEMENT V1
// assets/js/notice.js
// ======================================

let notices=[];

// ===============================
// MENU
// ===============================

document.addEventListener("click",function(e){

if(e.target.closest("#noticeMenu")){

e.preventDefault();

noticePage();

}

});

// ===============================
// PAGE
// ===============================

function noticePage(){

document.getElementById("pageTitle").innerText="Notice Management";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Notice Board</h4>

<button
class="btn-green"
id="addNoticeBtn">

Add Notice

</button>

</div>

<div class="table-responsive">

<table class="table">

<thead>

<tr>

<th>Title</th>

<th>Date</th>

<th>Status</th>

<th width="220">

Action

</th>

</tr>

</thead>

<tbody id="noticeTable">

<tr>

<td colspan="4">

Loading...

</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

`;

loadNotices();

}

// ===============================
// LOAD NOTICE
// ===============================

async function loadNotices(){

const table=document.getElementById("noticeTable");

const {data,error}=await window.supabaseClient

.from("notices")

.select("*")

.order("created_at",{ascending:false});

if(error){

table.innerHTML=`

<tr>

<td colspan="4">

${error.message}

</td>

</tr>

`;

return;

}

notices=data||[];

renderNotices(notices);

}

// ===============================
// RENDER
// ===============================

function renderNotices(list){

const table=document.getElementById("noticeTable");

table.innerHTML="";

if(list.length===0){

table.innerHTML=`

<tr>

<td colspan="4">

No Notice Found

</td>

</tr>

`;

return;

}

list.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.title}</td>

<td>${item.notice_date||""}</td>

<td>

<span class="badge bg-success">

${item.status||"Published"}

</span>

</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="viewNotice(${item.id})">

View

</button>

<button
class="btn btn-warning btn-sm"
onclick="editNotice(${item.id})">

Edit

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteNotice(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

}
// ======================================
// ADD / SAVE / VIEW / EDIT / DELETE NOTICE
// assets/js/notice.js
// নিচে Paste করো
// ======================================

// ADD NOTICE PAGE

document.addEventListener("click",function(e){

if(!e.target.closest("#addNoticeBtn")) return;

document.getElementById("pageTitle").innerText="Add Notice";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="noticeForm">

<div class="mb-3">

<label>Notice Title</label>

<input
type="text"
id="notice_title"
class="form-control"
required>

</div>

<div class="mb-3">

<label>Notice Details</label>

<textarea
id="notice_details"
rows="6"
class="form-control"
required></textarea>

</div>

<div class="row">

<div class="col-md-6 mb-3">

<label>Publish Date</label>

<input
type="date"
id="notice_date"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>Status</label>

<select
id="notice_status"
class="form-select">

<option>Published</option>

<option>Draft</option>

</select>

</div>

</div>

<button
class="btn-green"
type="submit">

Save Notice

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="noticePage()">

Cancel

</button>

</form>

</div>

</div>

`;

});

// SAVE

document.addEventListener("submit",async function(e){

if(e.target.id!=="noticeForm") return;

e.preventDefault();

const {error}=await window.supabaseClient

.from("notices")

.insert([{

title:document.getElementById("notice_title").value,

details:document.getElementById("notice_details").value,

notice_date:document.getElementById("notice_date").value,

status:document.getElementById("notice_status").value

}]);

if(error){

alert(error.message);

return;

}

alert("Notice Added Successfully");

noticePage();

});

// VIEW

window.viewNotice=function(id){

const notice=

notices.find(x=>x.id===id);

if(!notice) return;

alert(

notice.title+

"\n\n"+

notice.details

);

};

// DELETE

window.deleteNotice=async function(id){

if(!confirm("Delete Notice?")) return;

const {error}=await window.supabaseClient

.from("notices")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadNotices();

};

// EDIT

window.editNotice=async function(id){

const {data,error}=await window.supabaseClient

.from("notices")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

document.getElementById("pageTitle").innerText="Edit Notice";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="updateNoticeForm">

<input
type="hidden"
id="notice_id"
value="${data.id}">

<div class="mb-3">

<label>Title</label>

<input
type="text"
id="edit_notice_title"
class="form-control"
value="${data.title}"
required>

</div>

<div class="mb-3">

<label>Details</label>

<textarea
id="edit_notice_details"
rows="6"
class="form-control">${data.details||""}</textarea>

</div>

<div class="row">

<div class="col-md-6">

<input
type="date"
id="edit_notice_date"
class="form-control"
value="${data.notice_date||""}">

</div>

<div class="col-md-6">

<select
id="edit_notice_status"
class="form-select">

<option ${data.status=="Published"?"selected":""}>Published</option>

<option ${data.status=="Draft"?"selected":""}>Draft</option>

</select>

</div>

</div>

<br>

<button
class="btn-green">

Update Notice

</button>

</form>

</div>

</div>

`;

};

// UPDATE

document.addEventListener("submit",async function(e){

if(e.target.id!=="updateNoticeForm") return;

e.preventDefault();

const {error}=await window.supabaseClient

.from("notices")

.update({

title:document.getElementById("edit_notice_title").value,

details:document.getElementById("edit_notice_details").value,

notice_date:document.getElementById("edit_notice_date").value,

status:document.getElementById("edit_notice_status").value

})

.eq("id",document.getElementById("notice_id").value);

if(error){

alert(error.message);

return;

}

alert("Notice Updated Successfully");

noticePage();

}); 





