/* ===========================================
   MADRASA-E NURUL QURAN
   TEACHER-SALARY.JS
=========================================== */

const db = window.supabaseClient;

const teacherSelect = document.getElementById("teacherSelect");
const salaryForm = document.getElementById("salaryForm");
const salaryTable = document.getElementById("salaryTable");

document.getElementById("paymentDate").value =
new Date().toISOString().split("T")[0];

/* ===========================================
SESSION
=========================================== */

async function checkSession(){

const {data:{session}}=await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

/* ===========================================
LOAD TEACHERS
=========================================== */

async function loadTeachers(){

const {data,error}=await db

.from("teachers")

.select("teacher_id,name,salary")

.order("name");

if(error){

console.error(error);

return;

}

teacherSelect.innerHTML=
'<option value="">Select Teacher</option>';

data.forEach(t=>{

teacherSelect.innerHTML+=`

<option
value="${t.teacher_id}"
data-salary="${t.salary||0}">

${t.name} (${t.teacher_id})

</option>

`;

});

}

teacherSelect.addEventListener("change",()=>{

const salary=

teacherSelect.options[
teacherSelect.selectedIndex
].dataset.salary;

document.getElementById("salary").value=
salary||0;

});

/* ===========================================
SAVE
=========================================== */

salaryForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const salaryData={

teacher_id:
teacherSelect.value,

salary_month:
document.getElementById("salaryMonth").value,

salary:
Number(
document.getElementById("salary").value
),

payment_date:
document.getElementById("paymentDate").value,

remarks:
document.getElementById("remarks").value

};

const {error}=await db

.from("teacher_salary")

.insert(salaryData);

if(error){

alert(error.message);

return;

}

alert("Salary Saved Successfully");

salaryForm.reset();

document.getElementById("paymentDate").value=
new Date().toISOString().split("T")[0];

loadSalaryHistory();

});

/* ===========================================
LOAD HISTORY
=========================================== */

async function loadSalaryHistory(){

const {data,error}=await db

.from("teacher_salary")

.select("*")

.order("payment_date",{ascending:false});

if(error){

console.error(error);

return;

}

salaryTable.innerHTML="";

if(!data || data.length===0){

salaryTable.innerHTML=`

<tr>

<td colspan="5" class="text-center">

No Salary History

</td>

</tr>

`;

return;

}

for(const item of data){

const {data:teacher}=await db

.from("teachers")

.select("name")

.eq("teacher_id",item.teacher_id)

.single();

salaryTable.innerHTML+=`

<tr>

<td>${teacher?.name||item.teacher_id}</td>

<td>${item.salary_month}</td>

<td>৳${Number(item.salary).toLocaleString()}</td>

<td>${item.payment_date}</td>

<td>${item.remarks||""}</td>

</tr>

`;

}

}

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await loadTeachers();

await loadSalaryHistory();

});
