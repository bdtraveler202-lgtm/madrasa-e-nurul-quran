document.getElementById("menuAdmission").addEventListener("click", function(e){

e.preventDefault();

document.getElementById("contentArea").innerHTML = `

<h2 class="mb-4">🎓 Student Admission</h2>

<div class="card shadow">

<div class="card-body">

<form id="admissionForm">

<div class="row">

<div class="col-md-6 mb-3">
<label>Student ID</label>
<input type="text" id="student_id" class="form-control" readonly>
</div>

<div class="col-md-6 mb-3">
<label>Admission Date</label>
<input type="date" id="admission_date" class="form-control">
</div>

<div class="col-md-6 mb-3">
<label>শিক্ষার্থীর নাম</label>
<input type="text" id="full_name" class="form-control" required>
</div>

<div class="col-md-6 mb-3">
<label>পিতার নাম</label>
<input type="text" id="father_name" class="form-control" required>
</div>

<div class="col-md-6 mb-3">
<label>মাতার নাম</label>
<input type="text" id="mother_name" class="form-control" required>
</div>

<div class="col-md-6 mb-3">
<label>মোবাইল</label>
<input type="text" id="mobile" class="form-control" required>
</div>

<div class="col-md-6 mb-3">
<label>লিঙ্গ</label>
<select id="gender" class="form-select">
<option>ছাত্র</option>
<option>ছাত্রী</option>
</select>
</div>

<div class="col-md-6 mb-3">
<label>শ্রেণী</label>
<select id="class" class="form-select">

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

<div class="col-12 mb-3">
<label>ঠিকানা</label>
<textarea id="address" class="form-control"></textarea>
</div>

<div class="col-12">

<button class="btn btn-success">

Save Student

</button>

</div>

</div>

</form>

</div>

</div>

`;

}); 
// ======================================
// SAVE STUDENT
// ======================================

document.addEventListener("submit", async function(e){

if(e.target.id !== "admissionForm") return;

e.preventDefault();

const btn = e.target.querySelector("button");

btn.disabled = true;
btn.innerText = "Saving...";

const student = {

student_id: document.getElementById("student_id").value,

admission_date: document.getElementById("admission_date").value,

full_name: document.getElementById("full_name").value,

father_name: document.getElementById("father_name").value,

mother_name: document.getElementById("mother_name").value,

mobile: document.getElementById("mobile").value,

gender: document.getElementById("gender").value,

class: document.getElementById("class").value,

address: document.getElementById("address").value,

status: "Pending"

};

const { error } = await window.supabaseClient
.from("students")
.insert([student]);

btn.disabled = false;
btn.innerText = "Save Student";

if(error){

alert(error.message);

return;

}

alert("✅ Student Added Successfully");

e.target.reset();

loadStudentId();

});

// ======================================
// AUTO STUDENT ID
// ======================================

async function loadStudentId(){

const { count } = await window.supabaseClient
.from("students")
.select("*",{
count:"exact",
head:true
});

document.getElementById("student_id").value =
"STU-" + String((count || 0)+1).padStart(4,"0");

document.getElementById("admission_date").value =
new Date().toISOString().split("T")[0];

}

document.addEventListener("click",function(e){

if(e.target.id==="menuAdmission"){

setTimeout(loadStudentId,300);

}

});





