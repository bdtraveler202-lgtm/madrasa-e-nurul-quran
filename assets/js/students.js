/* ===========================================
   STUDENT MANAGEMENT
=========================================== */

async function checkSession() {

    const {

        data: {

            session

        }

    } = await supabase.auth.getSession();

    if (!session) {

        location.href = "login.html";

        return;

    }

}

checkSession();

/* ===========================================
AUTO STUDENT ID

FORMAT:
MDR-2026-000001
=========================================== */

async function generateStudentID() {

    const year = new Date().getFullYear();

    const {

        count

    } = await supabase

        .from("students")

        .select("*", {

            count: "exact",

            head: true

        });

    const next = String((count || 0) + 1)

        .padStart(6, "0");

    return `MDR-${year}-${next}`;

}

/* ===========================================
PHOTO UPLOAD
=========================================== */

async function uploadPhoto(file) {

    if (!file) return "";

    const fileName =

        Date.now() +

        "_" +

        file.name;

    const {

        error

    } = await supabase.storage

        .from("students")

        .upload(fileName, file);

    if (error) {

        throw error;

    }

    const {

        data

    } = supabase.storage

        .from("students")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

/* ===========================================
SAVE STUDENT
=========================================== */

const studentForm =

document.getElementById("studentForm");

studentForm.addEventListener(

"submit",

async e => {

e.preventDefault();

try{

const id=

await generateStudentID();

const image=

document.getElementById("studentPhoto").files[0];

const photo=

await uploadPhoto(image);

const{

error

}=await supabase

.from("students")

.insert({

student_id:id,

full_name:

document.getElementById("studentName").value,

father_name:

document.getElementById("fatherName").value,

mother_name:

document.getElementById("motherName").value,

mobile:

document.getElementById("studentMobile").value,

class_name:

document.getElementById("studentClass").value,

photo_url:photo,

status:"Active"

});

if(error) throw error;

alert(

"Student Registered Successfully"

);

studentForm.reset();

loadStudents();

bootstrap.Modal

.getInstance(

document.getElementById(

"studentModal"

)

).hide();

}catch(err){

alert(err.message);

}

});
/* ===========================================
   LOAD STUDENT LIST
=========================================== */

async function loadStudents() {

    const table = document.getElementById("studentTable");

    if (!table) return;

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `

<tr>

<td>${student.student_id}</td>

<td>

<img
src="${student.photo_url || 'assets/img/default-user.png'}"
class="student-photo">

</td>

<td>${student.full_name}</td>

<td>${student.class_name}</td>

<td>${student.mobile || ""}</td>

<td>

<span class="${student.status === "Active"
? "badge-active"
: "badge-inactive"}">

${student.status}

</span>

</td>

<td>

<button
class="action-btn view-btn"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="action-btn edit-btn"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete-btn"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}

/* ===========================================
SEARCH STUDENT
=========================================== */

const searchInput = document.getElementById("searchStudent");
const classFilter = document.getElementById("classFilter");

async function searchStudents() {

    let keyword = searchInput.value.trim();
    let className = classFilter.value;

    let query = supabase
        .from("students")
        .select("*");

    if (keyword) {

        query = query.or(
            `student_id.ilike.%${keyword}%,full_name.ilike.%${keyword}%,mobile.ilike.%${keyword}%`
        );

    }

    if (className) {

        query = query.eq("class_name", className);

    }

    const { data, error } = await query.order(
        "created_at",
        { ascending: false }
    );

    if (error) {

        console.error(error);

        return;

    }

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `

<tr>

<td>${student.student_id}</td>

<td>

<img
src="${student.photo_url || 'assets/img/default-user.png'}"
class="student-photo">

</td>

<td>${student.full_name}</td>

<td>${student.class_name}</td>

<td>${student.mobile || ""}</td>

<td>

<span class="${student.status === "Active"
? "badge-active"
: "badge-inactive"}">

${student.status}

</span>

</td>

<td>

<button
class="action-btn view-btn"
onclick="viewStudent('${student.student_id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="action-btn edit-btn"
onclick="editStudent('${student.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete-btn"
onclick="deleteStudent('${student.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}

document.getElementById("searchBtn")
.addEventListener("click", searchStudents);

searchInput.addEventListener("keyup", e => {

    if (e.key === "Enter") {

        searchStudents();

    }

});

classFilter.addEventListener("change", searchStudents);

/* ===========================================
DELETE STUDENT
=========================================== */

async function deleteStudent(id) {

    if (!confirm("Delete this student?")) return;

    const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadStudents();

}

/* ===========================================
VIEW PROFILE
=========================================== */

function viewStudent(studentID) {

    window.location.href =
        "student-profile.html?id=" +
        encodeURIComponent(studentID);

}

/* ===========================================
EDIT (Placeholder)
=========================================== */

function editStudent(id) {

    alert("Edit Module will be added in the next part.");

}

/* ===========================================
INIT
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadStudents();

}); 
/* ===========================================
   GET STUDENT BY ID
=========================================== */

async function getStudent(id) {

    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        alert(error.message);

        return null;

    }

    return data;

}

/* ===========================================
   UPDATE STUDENT
=========================================== */

async function updateStudent(id, values) {

    const { error } = await supabase
        .from("students")
        .update(values)
        .eq("id", id);

    if (error) {

        alert(error.message);

        return false;

    }

    loadStudents();

    return true;

}

/* ===========================================
   EDIT STUDENT
=========================================== */

async function editStudent(id) {

    const student = await getStudent(id);

    if (!student) return;

    document.getElementById("studentName").value =
        student.full_name || "";

    document.getElementById("fatherName").value =
        student.father_name || "";

    document.getElementById("motherName").value =
        student.mother_name || "";

    document.getElementById("studentMobile").value =
        student.mobile || "";

    document.getElementById("studentClass").value =
        student.class_name || "";

    const modal = new bootstrap.Modal(
        document.getElementById("studentModal")
    );

    modal.show();

    studentForm.onsubmit = async function (e) {

        e.preventDefault();

        const values = {

            full_name:
                document.getElementById("studentName").value,

            father_name:
                document.getElementById("fatherName").value,

            mother_name:
                document.getElementById("motherName").value,

            mobile:
                document.getElementById("studentMobile").value,

            class_name:
                document.getElementById("studentClass").value

        };

        const ok = await updateStudent(id, values);

        if (ok) {

            modal.hide();

            studentForm.reset();

            studentForm.onsubmit = null;

        }

    };

}

/* ===========================================
   PRINT ID CARD
=========================================== */

function printIDCard(studentID){

    window.open(
        "id-card.html?id=" +
        encodeURIComponent(studentID),
        "_blank"
    );

}

/* ===========================================
   PRINT ADMIT CARD
=========================================== */

function printAdmitCard(studentID){

    window.open(
        "admit-card.html?id=" +
        encodeURIComponent(studentID),
        "_blank"
    );

}






