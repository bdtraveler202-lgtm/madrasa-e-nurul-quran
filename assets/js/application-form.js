/* ===========================================
   MNQ
   APPLICATION FORM
=========================================== */

const db = window.supabaseClient;

/* ===========================================
GET STUDENT ID
=========================================== */

const params = new URLSearchParams(window.location.search);

const studentID = params.get("id");

if(!studentID){

document.getElementById("applicationData").innerHTML=

"<h3 class='text-danger text-center'>Student ID Not Found</h3>";

throw new Error("Student ID Missing");

}

/* ===========================================
LOAD APPLICATION
=========================================== */

async function loadApplication(){

try{

const {data,error}=await db

.from("students")

.select("*")

.eq("student_id",studentID)

.single();

if(error) throw error;

document.getElementById("studentPhoto").src=

data.photo_url||

"assets/img/default-user.png";

document.getElementById("applicationData").innerHTML=`

<div class="section">

Student Information

</div>

<table>

<tr>

<td width="25%"><b>Student ID</b></td>

<td>${data.student_id||""}</td>

<td width="25%"><b>Session</b></td>

<td>${data.session||""}</td>

</tr>

<tr>

<td><b>Name (Bangla)</b></td>

<td>${data.full_name_bn||""}</td>

<td><b>Name (English)</b></td>

<td>${data.full_name_en||""}</td>

</tr>

<tr>

<td><b>Department</b></td>

<td>${data.department||""}</td>

<td><b>Class</b></td>

<td>${data.class_name||""}</td>

</tr>

<tr>

<td><b>Roll</b></td>

<td>${data.roll||""}</td>

<td><b>Admission Date</b></td>

<td>${data.admission_date||""}</td>

</tr>
<tr>

<td><b>Gender</b></td>

<td>${data.gender||""}</td>

<td><b>Date of Birth</b></td>

<td>${data.dob||""}</td>

</tr>

<tr>

<td><b>Blood Group</b></td>

<td>${data.blood_group||""}</td>

<td><b>Religion</b></td>

<td>${data.religion||""}</td>

</tr>

<tr>

<td><b>Birth Certificate No</b></td>

<td colspan="3">

${data.birth_certificate||""}

</td>

</tr>

</table>

<div class="section">

Father Information

</div>

<table>

<tr>

<td width="25%"><b>Father Name</b></td>

<td>${data.father_name||""}</td>

<td width="25%"><b>Mobile</b></td>

<td>${data.father_mobile||""}</td>

</tr>

<tr>

<td><b>Occupation</b></td>

<td colspan="3">

${data.father_occupation||""}

</td>

</tr>

</table>

<div class="section">

Mother Information

</div>

<table>

<tr>

<td width="25%"><b>Mother Name</b></td>

<td>${data.mother_name||""}</td>

<td width="25%"><b>Mobile</b></td>

<td>${data.mother_mobile||""}</td>

</tr>

<tr>

<td><b>Occupation</b></td>

<td colspan="3">

${data.mother_occupation||""}

</td>

</tr>

</table>

<div class="section">

Guardian Information

</div>

<table>

<tr>

<td width="25%"><b>Guardian Name</b></td>

<td>${data.guardian_name||""}</td>

<td width="25%"><b>Relation</b></td>

<td>${data.guardian_relation||""}</td>

</tr>

<tr>

<td><b>Guardian Mobile</b></td>

<td>${data.guardian_mobile||""}</td>

<td><b>Emergency Contact</b></td>

<td>${data.emergency_contact||""}</td>

</tr>

</table> 
<div class="section">

Address Information

</div>

<table>

<tr>

<td width="25%"><b>Village</b></td>

<td>${data.village||""}</td>

<td width="25%"><b>Post Office</b></td>

<td>${data.post_office||""}</td>

</tr>

<tr>

<td><b>Upazila</b></td>

<td>${data.upazila||""}</td>

<td><b>District</b></td>

<td>${data.district||""}</td>

</tr>

<tr>

<td><b>Present Address</b></td>

<td colspan="3">

${data.present_address||""}

</td>

</tr>

<tr>

<td><b>Permanent Address</b></td>

<td colspan="3">

${data.permanent_address||""}

</td>

</tr>

</table>

<div class="section">

Fee Information

</div>

<table>

<tr>

<td width="25%"><b>Admission Fee</b></td>

<td>৳ ${data.admission_fee||0}</td>

<td width="25%"><b>Monthly Fee</b></td>

<td>৳ ${data.monthly_fee||0}</td>

</tr>

</table>

<div class="section">

Declaration

</div>

<p style="text-align:justify;margin-top:10px;">

আমি ঘোষণা করছি যে, এই আবেদনপত্রে প্রদত্ত সকল তথ্য আমার জানামতে সঠিক।
ভুল তথ্য প্রদান করলে মাদরাসা কর্তৃপক্ষ প্রয়োজনীয় ব্যবস্থা গ্রহণ করতে পারবে।

</p>

<div style="margin-top:35px;text-align:center;">

<img

src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${data.student_id}"

width="120">

<br><br>

<b>${data.student_id}</b>

</div>

<div class="signature">

<div>

Student Signature

</div>

<div>

Guardian Signature

</div>

<div>

Principal Signature

</div>

</div>

`;

}catch(err){

console.error(err);

document.getElementById("applicationData").innerHTML=

`<h3 class="text-danger text-center">${err.message}</h3>`;

}

}

/* ===========================================
LOAD PAGE
=========================================== */

loadApplication();
