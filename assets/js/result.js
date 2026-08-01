/* ===========================================
   MADRASA-E NURUL QURAN
   RESULTS.JS
=========================================== */

const db = window.supabaseClient;

const resultForm = document.getElementById("resultForm");
const resultTable = document.getElementById("resultTable");

const studentId = document.getElementById("studentId");
const examName = document.getElementById("examName");
const subject = document.getElementById("subject");
const fullMarks = document.getElementById("fullMarks");
const passMarks = document.getElementById("passMarks");
const obtainedMarks = document.getElementById("obtainedMarks");
const grade = document.getElementById("grade");

let editingResultId = null;

async function checkSession(){

const {data:{session}}=await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

function calculateGrade(){

const mark=Number(obtainedMarks.value||0);

let g="F";
let gp=0;

if(mark>=80){g="A+";gp=5;}
else if(mark>=70){g="A";gp=4;}
else if(mark>=60){g="A-";gp=3.5;}
else if(mark>=50){g="B";gp=3;}
else if(mark>=40){g="C";gp=2;}
else if(mark>=33){g="D";gp=1;}
else{g="F";gp=0;}

grade.value=g;

return gp;

}

obtainedMarks.addEventListener("input",calculateGrade);

resultForm.addEventListener("submit",saveResult);

async function saveResult(e){

e.preventDefault();

const gpa=calculateGrade();

const {data:student}=await db

.from("students")

.select("student_id")

.eq("student_id",studentId.value)

.maybeSingle();

if(!student){

alert("Student ID Not Found");

return;

}

const values={

student_id:studentId.value,

exam_name:examName.value,

subject:subject.value,

full_marks:Number(fullMarks.value),

pass_marks:Number(passMarks.value),

obtained_marks:Number(obtainedMarks.value),

grade:grade.value,

gpa:gpa

};

if(editingResultId){

const {error}=await db

.from("results")

.update(values)

.eq("id",editingResultId);

if(error){

alert(error.message);

return;

}

editingResultId=null;

alert("Result Updated");

resultForm.reset();

loadResults();

return;

}

const {data:existing}=await db

.from("results")

.select("id")

.eq("student_id",studentId.value)

.eq("exam_name",examName.value)

.eq("subject",subject.value)

.maybeSingle();

if(existing){

alert("Result Already Exists");

return;

}

const {error}=await db

.from("results")

.insert(values);

if(error){

alert(error.message);

return;

}

alert("Result Saved");

resultForm.reset();

loadResults();

} 
/* ==========================
   LOAD RESULTS
========================== */

async function loadResults() {

const {data,error}=await db

.from("results")

.select("*")

.order("id",{ascending:false});

if(error){

console.error(error);

return;

}

resultTable.innerHTML="";

if(!data || data.length===0){

resultTable.innerHTML=`
<tr>
<td colspan="8" class="text-center">
No Results Found
</td>
</tr>
`;

return;

}

data.forEach(r=>{

resultTable.innerHTML+=`

<tr>

<td>${r.student_id}</td>

<td>${r.exam_name}</td>

<td>${r.subject}</td>

<td>${r.obtained_marks}/${r.full_marks}</td>

<td>${r.grade}</td>

<td>${r.gpa}</td>

<td>${r.exam_date ?? ""}</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="editResult(${r.id})">

Edit

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteResult(${r.id})">

Delete

</button>

</td>

</tr>

`;

});

}

/* ==========================
   EDIT RESULT
========================== */

async function editResult(id){

const {data,error}=await db

.from("results")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

editingResultId=id;

studentId.value=data.student_id;

examName.value=data.exam_name;

subject.value=data.subject;

fullMarks.value=data.full_marks;

passMarks.value=data.pass_marks;

obtainedMarks.value=data.obtained_marks;

grade.value=data.grade;

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/* ==========================
   DELETE RESULT
========================== */

async function deleteResult(id){

if(!confirm("Delete this result?")) return;

const {error}=await db

.from("results")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadResults();

}

/* ==========================
   LOGOUT
========================== */

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",async(e)=>{

e.preventDefault();

await db.auth.signOut();

location.href="login.html";

});

}

/* ==========================
   INIT
========================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

loadResults();

});
