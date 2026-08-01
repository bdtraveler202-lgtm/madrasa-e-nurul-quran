/* ===========================================
   MADRASA-E NURUL QURAN
   EMPLOYEE.JS
=========================================== */

const db = window.supabaseClient;

const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable");

let editingEmployee = null;

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
EMPLOYEE ID
=========================================== */

async function generateEmployeeID(){

const year=new Date().getFullYear();

const {count}=await db

.from("employees")

.select("*",{

count:"exact",

head:true

});

const next=String((count||0)+1).padStart(5,"0");

const id=`EMP-${year}-${next}`;

document.getElementById("employeeID").value=id;

return id;

}

/* ===========================================
PHOTO UPLOAD
=========================================== */

async function uploadPhoto(file){

if(!file) return "";

const fileName=Date.now()+"_"+file.name;

const {error}=await db.storage

.from("employees")

.upload(fileName,file);

if(error) throw error;

const {data}=db.storage

.from("employees")

.getPublicUrl(fileName);

return data.publicUrl;

}
/* ===========================================
SAVE EMPLOYEE
=========================================== */

employeeForm.addEventListener("submit",async(e)=>{

e.preventDefault();

try{

let photoUrl="";

const file=document.getElementById("employeePhoto").files[0];

if(file){

photoUrl=await uploadPhoto(file);

}

const employee={

employee_id:editingEmployee?
document.getElementById("employeeID").value:
await generateEmployeeID(),

name:document.getElementById("employeeName").value,

designation:document.getElementById("designation").value,

department:document.getElementById("department").value,

joining_date:document.getElementById("joiningDate").value,

mobile:document.getElementById("mobile").value,

email:document.getElementById("email").value,

salary:Number(document.getElementById("salary").value||0),

address:document.getElementById("address").value

};

if(photoUrl){

employee.photo_url=photoUrl;

}

if(editingEmployee){

const {error}=await db

.from("employees")

.update(employee)

.eq("id",editingEmployee);

if(error) throw error;

alert("Employee Updated");

editingEmployee=null;

}else{

const {error}=await db

.from("employees")

.insert(employee);

if(error) throw error;

alert("Employee Saved");

}

employeeForm.reset();

await generateEmployeeID();

loadEmployees();

}catch(err){

alert(err.message);

}

}); 
/* ===========================================
LOAD EMPLOYEES
=========================================== */

async function loadEmployees(){

const {data,error}=await db

.from("employees")

.select("*")

.order("created_at",{ascending:false});

if(error){

console.error(error);

return;

}

employeeTable.innerHTML="";

if(!data || data.length===0){

employeeTable.innerHTML=`
<tr>
<td colspan="8" class="text-center">
No Employee Found
</td>
</tr>
`;

return;

}

data.forEach(emp=>{

employeeTable.innerHTML+=`

<tr>

<td>${emp.employee_id}</td>

<td>

<img
src="${emp.photo_url || 'assets/img/default-user.png'}"
style="width:45px;height:45px;border-radius:50%;object-fit:cover;">

</td>

<td>${emp.name}</td>

<td>${emp.designation}</td>

<td>${emp.department || "-"}</td>

<td>${emp.mobile || "-"}</td>

<td>৳${Number(emp.salary).toLocaleString()}</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="editEmployee('${emp.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteEmployee('${emp.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}

/* ===========================================
EDIT EMPLOYEE
=========================================== */

async function editEmployee(id){

const {data,error}=await db

.from("employees")

.select("*")

.eq("id",id)

.single();

if(error){

alert(error.message);

return;

}

editingEmployee=id;

document.getElementById("employeeID").value=data.employee_id;
document.getElementById("employeeName").value=data.name;
document.getElementById("designation").value=data.designation;
document.getElementById("department").value=data.department;
document.getElementById("joiningDate").value=data.joining_date;
document.getElementById("mobile").value=data.mobile;
document.getElementById("email").value=data.email;
document.getElementById("salary").value=data.salary;
document.getElementById("address").value=data.address;

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/* ===========================================
DELETE EMPLOYEE
=========================================== */

async function deleteEmployee(id){

if(!confirm("Delete Employee?")) return;

const {error}=await db

.from("employees")

.delete()

.eq("id",id);

if(error){

alert(error.message);

return;

}

loadEmployees();

}

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await generateEmployeeID();

await loadEmployees();

});
