// ======================================
// Result Management System
// ======================================

let results = [];

// ======================================
// Render Result Table
// ======================================

function renderResults(data) {

    const resultCount = document.getElementById("resultCount");

    if (resultCount) {
        resultCount.innerText = data.length;
    }

    const table = document.getElementById("resultTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                কোনো Result পাওয়া যায়নি
            </td>
        </tr>
        `;

        return;

    }

    data.forEach(result => {

        table.innerHTML += `

        <tr>

            <td>${result.id}</td>

            <td>${result.student_name}</td>

            <td>${result.roll}</td>

            <td>${result.class}</td>

            <td>${result.total}</td>

            <td>
                <span class="badge bg-success">
                    ${result.gpa}
                </span>
            </td>

            <td>
                <span class="badge bg-primary">
                    ${result.grade}
                </span>
            </td>

            <td>

                <button
                    class="btn btn-info btn-sm me-1"
                    onclick="viewResult(${result.id})">

                    <i class="fa-solid fa-eye"></i>

                    View

                </button>

                <button
                    class="btn btn-warning btn-sm me-1"
                    onclick="editResult(${result.id})">

                    <i class="fa-solid fa-pen"></i>

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteResult(${result.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================
// Load Results
// ======================================

async function loadResults() {

    const { data, error } = await window.supabaseClient

        .from("results")

        .select("*")

        .order("id", {
            ascending: false
        });

    if (error) {

        console.error(error);

        alert("Result লোড করা যায়নি");

        return;

    }

    results = data;

    renderResults(results);

}

// ======================================
// Search Result
// ======================================

function searchResults() {

    const keyword = document

        .getElementById("searchRoll")

        .value

        .toLowerCase();

    const filtered = results.filter(result => {

        return (

            result.student_name
                .toLowerCase()
                .includes(keyword)

            ||

            result.roll
                .toString()
                .includes(keyword)

        );

    });

    renderResults(filtered);

}

// ======================================
// GPA & Grade
// ======================================

function calculateResult(total) {

    const average = total / 5;

    let gpa = "0.00";

    let grade = "F";

    if (average >= 80) {

        gpa = "5.00";
        grade = "A+";

    }

    else if (average >= 70) {

        gpa = "4.00";
        grade = "A";

    }

    else if (average >= 60) {

        gpa = "3.50";
        grade = "A-";

    }

    else if (average >= 50) {

        gpa = "3.00";
        grade = "B";

    }

    else if (average >= 40) {

        gpa = "2.00";
        grade = "C";

    }

    else if (average >= 33) {

        gpa = "1.00";
        grade = "D";

    }

    return {

        gpa,
        grade

    };

}
// ======================================
// Save Result
// ======================================

const resultForm = document.getElementById("resultForm");

if (resultForm) {

    resultForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const student_name = document.getElementById("student_name").value.trim();
        const roll = document.getElementById("roll").value.trim();
        const studentClass = document.getElementById("class").value.trim();

        const bangla = Number(document.getElementById("bangla").value);
        const english = Number(document.getElementById("english").value);
        const math = Number(document.getElementById("math").value);
        const arabic = Number(document.getElementById("arabic").value);
        const quran = Number(document.getElementById("quran").value);

        // ছাত্রের Photo বের করা
        let photo = "";

        const { data: studentData } = await window.supabaseClient

            .from("students")

            .select("photo")

            .eq("full_name", student_name)

            .maybeSingle();

        if (studentData) {

            photo = studentData.photo;

        }

        const total = bangla + english + math + arabic + quran;

        const calc = calculateResult(total);

        const { error } = await window.supabaseClient

            .from("results")

            .insert([{

                student_name,

                roll,

                class: studentClass,

                photo,

                bangla,

                english,

                math,

                arabic,

                quran,

                total,

                gpa: calc.gpa,

                grade: calc.grade

            }]);

        if (error) {

            console.error(error);

            alert(error.message);

            return;

        }

        alert("✅ Result সফলভাবে সংরক্ষণ হয়েছে");

        resultForm.reset();

        loadResults();

    });

}

// ======================================
// View Result
// ======================================
function viewResult(id){

    window.location.href =
    "result-view.html?id=" + id;

}

// ======================================
// Edit Result
// ======================================

function editResult(id) {

    const result = results.find(r => r.id == id);

    if (!result) {

        alert("Result পাওয়া যায়নি");

        return;

    }

    document.getElementById("edit_id").value = result.id;

    document.getElementById("edit_student_name").value = result.student_name;

    document.getElementById("edit_roll").value = result.roll;

    document.getElementById("edit_class").value = result.class;

    document.getElementById("edit_bangla").value = result.bangla;

    document.getElementById("edit_english").value = result.english;

    document.getElementById("edit_math").value = result.math;

    document.getElementById("edit_arabic").value = result.arabic;

    document.getElementById("edit_quran").value = result.quran;

    new bootstrap.Modal(

        document.getElementById("editModal")

    ).show();

}
// ======================================
// Update Result
// ======================================

async function updateResult() {

    const id = document.getElementById("edit_id").value;

    const student_name = document.getElementById("edit_student_name").value.trim();
    const roll = document.getElementById("edit_roll").value.trim();
    const studentClass = document.getElementById("edit_class").value.trim();

    const bangla = Number(document.getElementById("edit_bangla").value);
    const english = Number(document.getElementById("edit_english").value);
    const math = Number(document.getElementById("edit_math").value);
    const arabic = Number(document.getElementById("edit_arabic").value);
    const quran = Number(document.getElementById("edit_quran").value);

    // ছাত্রের Photo আপডেট
    let photo = "";

    const { data: studentData } = await window.supabaseClient
        .from("students")
        .select("photo")
        .eq("full_name", student_name)
        .maybeSingle();

    if (studentData) {
        photo = studentData.photo;
    }

    const total = bangla + english + math + arabic + quran;

    const calc = calculateResult(total);

    const { error } = await window.supabaseClient
        .from("results")
        .update({

            student_name,
            roll,
            class: studentClass,

            photo,

            bangla,
            english,
            math,
            arabic,
            quran,

            total,
            gpa: calc.gpa,
            grade: calc.grade

        })
        .eq("id", id);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    bootstrap.Modal
        .getInstance(document.getElementById("editModal"))
        .hide();

    alert("✅ Result Updated Successfully");

    loadResults();

}

// ======================================
// Delete Result
// ======================================

async function deleteResult(id) {

    if (!confirm("আপনি কি এই Result Delete করতে চান?")) {
        return;
    }

    const { error } = await window.supabaseClient
        .from("results")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("🗑️ Result Delete হয়েছে");

    loadResults();

}

// ======================================
// Live Search
// ======================================

const searchInput = document.getElementById("searchRoll");

if (searchInput) {

    searchInput.addEventListener("input", searchResults);

}

// ======================================
// Initial Load
// ======================================

loadResults();

