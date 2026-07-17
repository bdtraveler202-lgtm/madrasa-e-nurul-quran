let students = [];

// =========================
// Load Students
// =========================

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

// =========================
// Render Table
// =========================

function renderStudents(list) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                কোনো শিক্ষার্থী পাওয়া যায়নি
            </td>
        </tr>
        `;

        return;

    }

    list.forEach(student => {

        table.innerHTML += `

        <tr>

            <td>${student.id}</td>

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
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm ms-2"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

// =========================
// Search + Filter
// =========================

function filterStudents() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const selectedClass = document
        .getElementById("classFilter")
        .value;

    const filtered = students.filter(student => {

        const matchName =
            student.full_name.toLowerCase().includes(search);

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

// =========================
// Delete Student
// =========================

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

        alert("❌ Delete করা যায়নি!");

        return;

    }

    alert("✅ শিক্ষার্থী সফলভাবে Delete হয়েছে");

    loadStudents();

}

// =========================
// Edit Student
// =========================

async function editStudent(id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    const newName = prompt("শিক্ষার্থীর নাম", student.full_name);
    if (newName === null) return;

    const newFather = prompt("পিতার নাম", student.father_name);
    if (newFather === null) return;

    const newMother = prompt("মাতার নাম", student.mother_name);
    if (newMother === null) return;

    const newMobile = prompt("মোবাইল", student.mobile);
    if (newMobile === null) return;

    const newClass = prompt("শ্রেণী", student.class);
    if (newClass === null) return;

    const newAddress = prompt("ঠিকানা", student.address);
    if (newAddress === null) return;

    const { error } = await window.supabaseClient
        .from("students")
        .update({

            full_name: newName,
            father_name: newFather,
            mother_name: newMother,
            mobile: newMobile,
            class: newClass,
            address: newAddress

        })
        .eq("id", id);

    if (error) {

        console.error(error);

        alert("❌ Update করা যায়নি!");

        return;

    }

    alert("✅ তথ্য সফলভাবে Update হয়েছে");

    loadStudents();

}

// =========================
// Start
// =========================

loadStudents();
