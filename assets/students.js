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
