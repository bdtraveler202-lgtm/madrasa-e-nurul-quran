document.getElementById("menuAdmission").addEventListener("click", function (e) {

    e.preventDefault();

    document.getElementById("moduleContent").innerHTML = `

<div class="card shadow">

<div class="card-header bg-success text-white">

<h4 class="mb-0">
🎓 Student Admission
</h4>

</div>

<div class="card-body">

<form id="admissionForm">

<div class="row">

<div class="col-md-6 mb-3">

<label>শিক্ষার্থীর নাম</label>

<input
type="text"
id="full_name"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>পিতার নাম</label>

<input
type="text"
id="father_name"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>মাতার নাম</label>

<input
type="text"
id="mother_name"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>মোবাইল</label>

<input
type="text"
id="mobile"
class="form-control"
required>

</div>

<div class="col-md-6 mb-3">

<label>শ্রেণী</label>

<select
id="student_class"
class="form-select">

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

<div class="col-md-6 mb-3">

<label>ভর্তির তারিখ</label>

<input
type="date"
id="admission_date"
class="form-control">

</div>

<div class="col-12">

<button
class="btn btn-success"
type="submit">

Save Student

</button>

</div>

</div>

</form>

</div>

</div>

`;

});
