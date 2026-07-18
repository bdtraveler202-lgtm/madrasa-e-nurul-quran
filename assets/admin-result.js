alert("admin-result.js loaded");

// ======================================
// Result Management
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
                <button class="btn btn-sm btn-danger" disabled>
                    Delete
                </button>
            </td>

        </tr>
        `;

    });

}

// ======================================
// GPA + Grade
// ======================================

function calculateResult(total) {

    const average = total / 5;

    let gpa = 0;
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

    return { gpa, grade };

}

// ======================================
// Add Result
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

loadResults();
