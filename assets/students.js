let students = [];

// ===============================
// Load Students
// ===============================

async function loadStudents() {

    const { data, error } = await window.supabaseClient
        .from("students")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        alert("ডেটা লোড করা যায়নি!");
        return;
    }

    students = data;
    renderStudents(students);

}

// ===============================
// Render Table
// ===============================

function renderStudents(list) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                কোনো শিক্ষার্থী পাওয়া যায়নি
            </td>
        </tr>
        `;

        return;

    }

    list.forEach(student => {

        const photo = student.photo
            ? student.photo
            : "https://placehold.co/60x60?text=No+Photo";

        table.innerHTML += `

        <tr>

            <td>${student.id}</td>

            <td>

                <img
                    src="${photo}"
                    width="60"
                    height="60"
                    style="
                        object-fit:cover;
                        border-radius:50%;
                        border:2px solid #198754;
                    ">

            </td>

            <td>${student.full_name}</td>

            <td>${student.father_name}</td>

            <td>${student.mother_name}</td>

            <td>${student.mobile}</td>

            <td>${student.class}</td>

            <td>${student.address}</td>

            <td>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="editStudent(${student.id})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm ms-2"
                    onclick="deleteStudent(${student.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ===============================
// Search & Filter
// ===============================

function filterStudents() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const selectedClass = document
        .getElementById("classFilter")
        .value;

    const filtered = students.filter(student => {

        const matchName = student.full_name
            .toLowerCase()
            .includes(search);

        const matchClass =
            selectedClass === "" ||
            student.class === selectedClass;

        return matchName && matchClass;

    });

    renderStudents(filtered);

}

document
    .getElementById("searchInput")
    .addEventListener("input", filterStudents);

document
    .getElementById("classFilter")
    .addEventListener("change", filterStudents);

// ===============================
// Delete Student
// ===============================

async function deleteStudent(id) {

    if (!confirm("আপনি কি এই শিক্ষার্থীকে Delete করতে চান?")) {
        return;
    }

    const { error } = await window.supabaseClient
        .from("students")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        alert("Delete করা যায়নি!");

        return;

    }

    alert("✅ শিক্ষার্থী সফলভাবে Delete হয়েছে");

    loadStudents();

}

// ===============================
// Edit Student
// ===============================

async function editStudent(id) {

    const student = students.find(s => s.id == id);

    if (!student) return;

    document.getElementById("edit_id").value = student.id;
    document.getElementById("edit_name").value = student.full_name;
    document.getElementById("edit_father").value = student.father_name;
    document.getElementById("edit_mother").value = student.mother_name;
    document.getElementById("edit_mobile").value = student.mobile;
    document.getElementById("edit_class").value = student.class;
    document.getElementById("edit_address").value = student.address;

    const modal = new bootstrap.Modal(
        document.getElementById("editModal")
    );

    modal.show();

}

// ===============================
// Save Student
// ===============================

async function saveStudent() {

    const id = document.getElementById("edit_id").value;

    const { error } = await window.supabaseClient
        .from("students")
        .update({

            full_name: document.getElementById("edit_name").value,

            father_name: document.getElementById("edit_father").value,

            mother_name: document.getElementById("edit_mother").value,

            mobile: document.getElementById("edit_mobile").value,

            class: document.getElementById("edit_class").value,

            address: document.getElementById("edit_address").value

        })
        .eq("id", id);

    if (error) {

        console.error(error);

        alert("Update করা যায়নি!");

        return;

    }

    bootstrap.Modal
        .getInstance(document.getElementById("editModal"))
        .hide();

    alert("✅ তথ্য সফলভাবে Update হয়েছে");

    loadStudents();

}

// ===============================
// Start
// ===============================

loadStudents();
