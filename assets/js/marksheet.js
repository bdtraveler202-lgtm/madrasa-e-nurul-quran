/* ===========================================
   MADRASA-E NURUL QURAN
   MARKSHEET.JS
=========================================== */

const db = window.supabaseClient;

const loadBtn = document.getElementById("loadMarksheet");

const studentIdInput = document.getElementById("studentId");
const examInput = document.getElementById("examName");

const marksTable = document.getElementById("marksTable");

const studentPhoto = document.getElementById("studentPhoto");
const studentName = document.getElementById("studentName");
const studentCode = document.getElementById("studentCode");
const studentClass = document.getElementById("studentClass");
const fatherName = document.getElementById("fatherName");

const totalMarks = document.getElementById("totalMarks");
const finalGrade = document.getElementById("finalGrade");
const finalGPA = document.getElementById("finalGPA");

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
LOAD MARKSHEET
========================== */

async function loadMarksheet(){

    const studentId=studentIdInput.value.trim();
    const examName=examInput.value.trim();

    if(!studentId || !examName){

        alert("Student ID এবং Exam Name লিখুন");
        return;

    }

    /* Student */

    const {data:student}=await db

    .from("students")

    .select("*")

    .eq("id",studentId)

    .single();

    if(!student){

        alert("Student পাওয়া যায়নি");
        return;

    }

    studentPhoto.src=student.photo || "assets/img/avatar.png";

    studentName.textContent=student.name;

    studentCode.textContent=student.id;

    studentClass.textContent=student.class;

    fatherName.textContent=student.father_name || "-";

    /* Results */

    const {data:results,error}=await db

    .from("results")

    .select("*")

    .eq("student_id",studentId)

    .eq("exam_name",examName)

    .order("subject");

    if(error){

        alert(error.message);
        return;

    }

    marksTable.innerHTML="";

    let total=0;
    let gpa=0;

    if(results.length===0){

        marksTable.innerHTML=`
<tr>
<td colspan="5">No Result Found</td>
</tr>`;

        return;

    }

    results.forEach(r=>{

        total+=Number(r.obtained_marks);

        gpa+=Number(r.gpa);

        marksTable.innerHTML+=`

<tr>

<td>${r.subject}</td>

<td>${r.full_marks}</td>

<td>${r.obtained_marks}</td>

<td>${r.grade}</td>

<td>${r.gpa}</td>

</tr>

`;

    });

    const avg=(gpa/results.length).toFixed(2);

    totalMarks.textContent=total;

    finalGPA.textContent=avg;

    if(avg>=5)
        finalGrade.textContent="A+";
    else if(avg>=4)
        finalGrade.textContent="A";
    else if(avg>=3.5)
        finalGrade.textContent="A-";
    else if(avg>=3)
        finalGrade.textContent="B";
    else if(avg>=2)
        finalGrade.textContent="C";
    else if(avg>=1)
        finalGrade.textContent="D";
    else
        finalGrade.textContent="F";

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

});

loadBtn.addEventListener("click",loadMarksheet);
