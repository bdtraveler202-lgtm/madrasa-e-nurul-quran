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

/* ==========================
SESSION
========================== */

async function checkSession(){

    const {data:{session}}=await db.auth.getSession();

    if(!session){

        location.href="login.html";
        return false;

    }

    return true;

}

/* ==========================
GRADE
========================== */

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

/* ==========================
SAVE RESULT
========================== */

resultForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const gpa=calculateGrade();

    const {error}=await db
    .from("results")
    .insert({

        student_id:studentId.value,

        exam_name:examName.value,

        subject:subject.value,

        full_marks:Number(fullMarks.value),

        pass_marks:Number(passMarks.value),

        obtained_marks:Number(obtainedMarks.value),

        grade:grade.value,

        gpa:gpa

    });

    if(error){

        alert(error.message);
        return;

    }

    alert("Result Saved");

    resultForm.reset();

    loadResults();

});

/* ==========================
LOAD RESULTS
========================== */

async function loadResults(){

    const {data,error}=await db

    .from("results")

    .select("*")

    .order("id",{ascending:false});

    if(error){

        console.log(error);
        return;

    }

    resultTable.innerHTML="";

    if(!data.length){

        resultTable.innerHTML=`
<tr>
<td colspan="7">No Results Found</td>
</tr>`;

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

<td>${r.exam_date??""}</td>

</tr>

`;

    });

}

/* ==========================
LOGOUT
========================== */

document.getElementById("logoutBtn").addEventListener("click",async(e)=>{

    e.preventDefault();

    await db.auth.signOut();

    location.href="login.html";

});

/* ==========================
INIT
========================== */

document.addEventListener("DOMContentLoaded",async()=>{

    const ok=await checkSession();

    if(!ok) return;

    loadResults();

});
