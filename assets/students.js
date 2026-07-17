let students = [];

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

function renderStudents(list) {

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                কোনো শিক্ষার্থী পাওয়া যায়নি
            </td>
        </tr>`;
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
        </tr>
        `;

    });

}

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

document.getElementById("searchInput")
.addEventListener("input", filterStudents);

document.getElementById("classFilter")
.addEventListener("change", filterStudents);

loadStudents();
