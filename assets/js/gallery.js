// ======================================
// GALLERY MANAGEMENT V1
// assets/js/gallery.js
// ======================================

let galleryImages=[];

// ===============================
// MENU
// ===============================

document.addEventListener("click",function(e){

if(e.target.closest("#galleryMenu")){

e.preventDefault();

galleryPage();

}

});

// ===============================
// PAGE
// ===============================

function galleryPage(){

document.getElementById("pageTitle").innerText="Gallery";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Gallery</h4>

<button
class="btn-green"
id="addGalleryBtn">

Upload Image

</button>

</div>

<div class="row" id="galleryGrid">

Loading...

</div>

</div>

</div>

`;

loadGallery();

}

// ===============================
// LOAD GALLERY
// ===============================

async function loadGallery(){

const grid=document.getElementById("galleryGrid");

const {data,error}=await window.supabaseClient

.from("gallery")

.select("*")

.order("created_at",{ascending:false});

if(error){

grid.innerHTML=error.message;

return;

}

galleryImages=data||[];

renderGallery();

}

// ===============================
// RENDER
// ===============================

function renderGallery(){

const grid=document.getElementById("galleryGrid");

grid.innerHTML="";

if(galleryImages.length===0){

grid.innerHTML="<h5>No Image Found</h5>";

return;

}

galleryImages.forEach(item=>{

grid.innerHTML+=`

<div class="col-md-3 mb-4">

<div class="card">

<img
src="${item.image_url}"
style="height:220px;object-fit:cover;">

<div class="card-body">

<h6>${item.title}</h6>

<button
class="btn btn-danger btn-sm w-100"
onclick="deleteGallery(${item.id})">

Delete

</button>

</div>

</div>

</div>

`;

});

}

// ===============================
// UPLOAD FORM
// ===============================

document.addEventListener("click",function(e){

if(!e.target.closest("#addGalleryBtn")) return;

document.getElementById("pageTitle").innerText="Upload Image";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="galleryForm">

<div class="mb-3">

<label>Image Title</label>

<input
type="text"
id="galleryTitle"
class="form-control"
required>

</div>

<div class="mb-3">

<label>Select Image</label>

<input
type="file"
id="galleryImage"
class="form-control"
accept="image/*"
required>

</div>

<button
class="btn-green">

Upload Image

</button>

<button
type="button"
class="btn btn-secondary ms-2"
onclick="galleryPage()">

Cancel

</button>

</form>

</div>

</div>

`;

});

// ===============================
// IMAGE UPLOAD
// ===============================

async function uploadGalleryImage(file){

const fileName=Date.now()+"_"+file.name;

const {error}=await window.supabaseClient.storage

.from("gallery-images")

.upload(fileName,file,{upsert:true});

if(error) throw error;

const {data}=window.supabaseClient.storage

.from("gallery-images")

.getPublicUrl(fileName);

return data.publicUrl;

}

// ===============================
// SAVE IMAGE
// ===============================

document.addEventListener("submit",async function(e){

if(e.target.id!=="galleryForm") return;

e.preventDefault();

try{

const file=document.getElementById("galleryImage").files[0];

const image_url=await uploadGalleryImage(file);

const {error}=await window.supabaseClient

.from("gallery")

.insert([{

title:document.getElementById("galleryTitle").value,

image_url

}]);

if(error){

alert(error.message);

return;

}

alert("Image Uploaded");

galleryPage();

}catch(err){

alert(err.message);

}

});

// ===============================
// DELETE IMAGE
// ===============================

window.deleteGallery=async function(id){

if(!confirm("Delete Image?")) return;

const {error}=await window.supabaseClient

.from("gallery")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadGallery();

}
