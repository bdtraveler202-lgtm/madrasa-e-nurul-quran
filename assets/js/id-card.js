/* ===========================================
   MNQ ID CARD
=========================================== */

const db = window.supabaseClient;

/* ===========================================
GET STUDENT ID
=========================================== */

const params=new URLSearchParams(window.location.search);

const studentID=params.get("id");

if(!studentID){

document.body.innerHTML=`

<div class="container mt-5">

<div class="alert alert-danger">

Student ID Not Found.

</div>

</div>

`;

throw new Error("Student ID Missing");

}

/* ===========================================
LOAD ID CARD
=========================================== */

async function loadIDCard(){

try{

const {data,error}=await db

.from("students")

.select("*")

.eq("student_id",studentID)

.single();

if(error) throw error;

const photo=

data.photo_url||

"assets/img/default-user.png";

const qr=

`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.student_id}`;

document.getElementById("frontCard").innerHTML=`

<div class="front-header">

<img src="assets/img/logo.png">

<h4>মাদরাসা-ই নূরুল কুরআন</h4>

<p>Vollobpur, Dighuli, Chandraganj, Lakshmipur</p>

</div>

<img

src="${photo}"

class="student-photo">

<div class="info">

<h5 class="text-center fw-bold">

${data.full_name_bn}

</h5>

<p class="text-center text-muted">

Student

</p>

<table>

<tr>

<td><b>ID</b></td>

<td>${data.student_id}</td>

</tr>

<tr>

<td><b>Session</b></td>

<td>${data.session}</td>

</tr>

<tr>

<td><b>Department</b></td>

<td>${data.department}</td>

</tr>

<tr>

<td><b>Class</b></td>

<td>${data.class_name}</td>

</tr>

<tr>

<td><b>Roll</b></td>

<td>${data.roll}</td>

</tr> 
<tr>

<td><b>Blood</b></td>

<td>${data.blood_group||""}</td>

</tr>

</table>

</div>

<div class="footer">

<img

src="${qr}"

class="qr">

<div class="signature">

Principal Signature

</div>

</div>

`;

/* ===========================================
BACK SIDE
=========================================== */

document.getElementById("backCard").innerHTML=`

<div class="front-header">

<h4>ID CARD</h4>

<p>Back Side</p>

</div>

<div class="info">

<table>

<tr>

<td><b>Father</b></td>

<td>${data.father_name||""}</td>

</tr>

<tr>

<td><b>Mother</b></td>

<td>${data.mother_name||""}</td>

</tr>

<tr>

<td><b>Guardian</b></td>

<td>${data.guardian_mobile||""}</td>

</tr>

<tr>

<td><b>DOB</b></td>

<td>${data.dob||""}</td>

</tr>

<tr>

<td><b>Address</b></td>

<td>

${data.village||""},

${data.post_office||""},

${data.upazila||""},

${data.district||""}

</td>

</tr>

</table>

<hr>

<p style="font-size:13px;text-align:center;">

এই পরিচয়পত্রটি মাদরাসা-ই নূরুল কুরআনের সম্পত্তি।
হারিয়ে গেলে অনুগ্রহ করে নিকটস্থ ব্যক্তির মাধ্যমে অথবা
মাদরাসা অফিসে জমা দিন।

</p>

<hr>

<div class="text-center">

<b>

Emergency Contact

</b>

<br>

${data.emergency_contact||data.guardian_mobile||""}

</div>

<div class="mt-4 text-center">

<b>

Website

</b>

<br>

www.mnq.edu.bd

</div>

</div>

`;

}catch(err){

console.error(err);

document.body.innerHTML=`

<div class="container mt-5">

<div class="alert alert-danger">

${err.message}

</div>

</div>

`;

}

}

loadIDCard();



