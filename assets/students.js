// ======================================
// STUDENT MANAGEMENT V3 - PART 1
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
        alert(error.message);
        return;
    }

    if (!data.session) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    await loadStudents();
}

checkLogin();

// ======================================
// LOAD STUDENTS
// ======================================

async function loadStudents() {

    const table = document.getElementById("studentTable");

    if (table) {
        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                Loading Students...
            </td>
        </tr>`;
    }

    const { data, error } =
        await window.supabaseClient
            .from("students")
            .select("*")
            .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        if (table) {
            table.innerHTML = `
            <tr>
                <td colspan="7" class="text-danger text-center">
                    ${error.message}
                </td>
            </tr>`;
        }

        return;
    }

    students = data || [];

    const total = document.getElementById("totalStudents");

    if (total) {
        total.innerText = students.length;
    }

    renderStudentTable(students);
}

// ======================================
// RENDER TABLE
// ======================================

function renderStudentTable(list) {

    const table = document.getElementById("studentTable");

    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No Students Found
            </td>
        </tr>`;

        return;
    }

    list.forEach(student => {

        table.innerHTML += `

<tr>

<td>
<img
src="${student.photo_url || "https://placehold.co/60x60?text=Photo"}"
style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
</td>

<td>${student.student_id || "-"}</td>

<td>${student.full_name || "-"}</td>

<td>${student.class || "-"}</td>

<td>${student.mobile || "-"}</td>

<td>
<span class="badge bg-warning">
${student.status || "Pending"}
</span>
</td>

<td>

<button class="btn btn-info btn-sm" disabled>
👁
</button>

<button class="btn btn-warning btn-sm" disabled>
✏️
</button>

<button class="btn btn-danger btn-sm" disabled>
🗑
</button>

</td>

</tr>

`;

    });

} 













