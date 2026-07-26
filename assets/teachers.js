// ======================================
// TEACHER MANAGEMENT V1
// ======================================

let teachers = [];

// ======================================
// LOGIN CHECK
// ======================================

async function checkLogin() {

    const { data, error } =
    await window.supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        return;

    }

    if (!data.session) {

        alert("Please login first");

        window.location.href = "login.html";

        return;

    }

    loadTeachers();

}

checkLogin();

// ======================================
// LOAD TEACHERS
// ======================================

async function loadTeachers() {

    const table =
    document.getElementById("teacherTable");

    table.innerHTML = `
    <tr>
        <td colspan="6" class="text-center">
            Loading...
        </td>
    </tr>`;

    const { data, error } =
    await window.supabaseClient
    .from("teachers")
    .select("*")
    .order("created_at", { ascending:false });

    if(error){

        table.innerHTML = `
        <tr>
            <td colspan="6" class="text-danger text-center">
                ${error.message}
            </td>
        </tr>`;

        return;

    }

    teachers = data || [];

    renderTeacherTable(teachers);

}

// ======================================
// RENDER TABLE
// ======================================

function renderTeacherTable(list){

    const table =
    document.getElementById("teacherTable");

    table.innerHTML = "";

    if(list.length===0){

        table.innerHTML=`
        <tr>
            <td colspan="6" class="text-center">
                No Teachers Found
            </td>
        </tr>`;

        return;

    }

    list.forEach(teacher=>{

        table.innerHTML += `

<tr>

<td>

<img
src="${teacher.photo_url || 'https://placehold.co/60x60?text=Photo'}"
class="teacher-photo">

</td>

<td>${teacher.name || "-"}</td>

<td>${teacher.designation || "-"}</td>

<td>${teacher.mobile || "-"}</td>

<td>

<span class="badge bg-success">

${teacher.status || "Active"}

</span>

</td>

<td>

<button
class="btn btn-info btn-sm"
onclick="viewTeacher(${teacher.id})">

<i class="fa fa-eye"></i>

</button>

<button
class="btn btn-warning btn-sm"
onclick="editTeacher(${teacher.id})">

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteTeacher(${teacher.id})">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
// ======================================
// SEARCH
// ======================================

const searchTeacher =
document.getElementById("searchTeacher");

if(searchTeacher){

searchTeacher.addEventListener("input",filterTeachers);

}

// ======================================
// STATUS FILTER
// ======================================

const statusFilter =
document.getElementById("statusFilter");

if(statusFilter){

statusFilter.addEventListener("change",filterTeachers);

}

// ======================================
// FILTER
// ======================================

function filterTeachers(){

const keyword =
(document.getElementById("searchTeacher")?.value || "")
.toLowerCase();

const status =
document.getElementById("statusFilter")?.value || "";

const filtered =
teachers.filter(teacher=>{

const matchSearch =

(teacher.name || "")
.toLowerCase()
.includes(keyword)

||

(teacher.mobile || "")
.toLowerCase()
.includes(keyword)

||

(teacher.designation || "")
.toLowerCase()
.includes(keyword);

const matchStatus =

status==="" ||

teacher.status===status;

return matchSearch && matchStatus;

});

renderTeacherTable(filtered);

}

// ======================================
// VIEW
// ======================================

window.viewTeacher=function(id){

window.location.href=
"teacher-profile.html?id="+id;

}

// ======================================
// EDIT
// ======================================

window.editTeacher=function(id){

alert("Edit Module Coming Soon");

}

// ======================================
// DELETE
// ======================================

window.deleteTeacher=async function(id){

const ok=
confirm("এই শিক্ষককে Delete করতে চান?");

if(!ok) return;

const { error }=
await window.supabaseClient
.from("teachers")
.delete()
.eq("id",id);

if(error){

alert(error.message);

return;

}

alert("✅ Teacher Deleted Successfully");

loadTeachers();

};
