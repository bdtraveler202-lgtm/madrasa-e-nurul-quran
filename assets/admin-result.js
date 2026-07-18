// ======================================
// Result Management
// ======================================

let results = [];

// ======================================
// Render Result Table
// ======================================

function renderResults(data) {
document.getElementById("resultCount").innerText = data.length;
    const table = document.getElementById("resultTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                কোনো Result পাওয়া যায়নি
            </td>
        </tr>`;

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

            <td>${result.gpa}</td>

            <td>${result.grade}</td>

         <td>

    <button
        class="btn btn-warning btn-sm me-1"
        onclick="editResult(${result.id})">

        Edit

    </button>

    <button
        class="btn btn-danger btn-sm"
        disabled>

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
        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        alert("Result লোড করা যায়নি!");

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

            result.roll.toString().includes(keyword)

            ||

            result.student_name
                .toLowerCase()
                .includes(keyword)

        );

    });

    renderResults(filtered);

}

// ======================================
// GPA + Grade
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

resultForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const student_name = document.getElementById("student_name").value;

    const roll = document.getElementById("roll").value;

    const studentClass = document.getElementById("class").value;

    const bangla = Number(document.getElementById("bangla").value);

    const english = Number(document.getElementById("english").value);

    const math = Number(document.getElementById("math").value);

    const arabic = Number(document.getElementById("arabic").value);

    const quran = Number(document.getElementById("quran").value);

    const total = bangla + english + math + arabic + quran;

    const result = calculateResult(total);

    const { error } = await window.supabaseClient

        .from("results")

        .insert([{

            student_name,

            roll,

            class: studentClass,

            bangla,

            english,

            math,

            arabic,

            quran,

            total,

            gpa: result.gpa,

            grade: result.grade

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

// ======================================
// Start
// ======================================

loadResults();

// ======================================
// Live Search
// ======================================

document
    .getElementById("searchRoll")
    .addEventListener("input", searchResults);
// ======================================
// Edit Result
// ======================================

async function editResult(id){

const result = results.find(r=>r.id===id);

document.getElementById("edit_id").value=result.id;

document.getElementById("edit_student_name").value=result.student_name;

document.getElementById("edit_roll").value=result.roll;

document.getElementById("edit_class").value=result.class;

document.getElementById("edit_bangla").value=result.bangla;

document.getElementById("edit_english").value=result.english;

document.getElementById("edit_math").value=result.math;

document.getElementById("edit_arabic").value=result.arabic;

document.getElementById("edit_quran").value=result.quran;

new bootstrap.Modal(
document.getElementById("editModal")
).show();

}

// ======================================
// Update Result
// ======================================

async function updateResult(){

const id=document.getElementById("edit_id").value;

const student_name=document.getElementById("edit_student_name").value;

const roll=document.getElementById("edit_roll").value;

const studentClass=document.getElementById("edit_class").value;

const bangla=Number(document.getElementById("edit_bangla").value);

const english=Number(document.getElementById("edit_english").value);

const math=Number(document.getElementById("edit_math").value);

const arabic=Number(document.getElementById("edit_arabic").value);

const quran=Number(document.getElementById("edit_quran").value);

const total=bangla+english+math+arabic+quran;

const calc=calculateResult(total);

const {error}=await window.supabaseClient

.from("results")

.update({

student_name,

roll,

class:studentClass,

bangla,

english,

math,

arabic,

quran,

total,

gpa:calc.gpa,

grade:calc.grade

})

.eq("id",id);

if(error){

alert(error.message);

return;

}

bootstrap.Modal.getInstance(

document.getElementById("editModal")

).hide();

alert("✅ Result Updated");

loadResults();

}
