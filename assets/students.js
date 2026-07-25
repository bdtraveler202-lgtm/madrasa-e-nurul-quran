// ======================================
// STUDENT MANAGEMENT V2
// ======================================

let students = [];

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

    loadStudents();

}

checkLogin();


// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents() {

    const { data, error } =
        await window.supabaseClient
        .from("students")
        .select("*")
        .order("created_at", { ascending:false });

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    students = data || [];

    document.getElementById("totalStudents").innerText =
        students.length;

    renderStudentTable(students);

}


// ======================================
// RENDER TABLE
// ======================================

function renderStudentTable(list){

    const table =
    document.getElementById("studentTable");

    table.innerHTML = "";

    if(list.length===0){

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No Students Found
            </td>
        </tr>
        `;

        return;

    }

    list.forEach(student=>{

        table.innerHTML += `

<tr>

<td>

<img
src="${student.photo_url || 'https://placehold.co/60x60?text=Photo'}"
class="student-photo">

</td>

<td>

${student.student_id || "-"}

</td>

<td>

${student.full_name}

</td>

<td>

${student.class || "-"}

</td>

<td>

${student.mobile || "-"}

</td>

<td>

<span class="badge bg-${student.status==="Approved"?"success":student.status==="Rejected"?"danger":"warning"}">

${student.status || "Pending"}

</span>

</td>

<td>

<button
class="btn btn-info btn-sm"
disabled>

<i class="fa fa-eye"></i>

</button>

<button
class="btn btn-warning btn-sm"
disabled>

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm"
disabled>

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
