/* ===========================================
   MADRASA-E NURUL QURAN
   ATTENDANCE.JS
=========================================== */

const db = window.supabaseClient;

const attendanceTable = document.getElementById("attendanceTable");
const classFilter = document.getElementById("classFilter");
const searchStudent = document.getElementById("searchStudent");
const attendanceDate = document.getElementById("attendanceDate");
const loadStudentsBtn = document.getElementById("loadStudents");
const saveAttendanceBtn = document.getElementById("saveAttendance");

/* ===========================================
   SESSION CHECK
=========================================== */

async function checkSession() {

    const { data: { session } } = await db.auth.getSession();

    if (!session) {

        window.location.href = "login.html";
        return false;

    }

    return true;

}

/* ===========================================
   TODAY DATE
=========================================== */

attendanceDate.value = new Date().toISOString().split("T")[0];

/* ===========================================
   LOAD STUDENTS
=========================================== */

async function loadStudents() {

    attendanceTable.innerHTML = `
    <tr>
        <td colspan="7" class="text-center">
            Loading...
        </td>
    </tr>`;

    let query = db
        .from("students")
        .select("*")
        .order("student_name_bn");

    if (classFilter.value) {

        query = query.eq("class_name", classFilter.value);

    }

    if (searchStudent.value.trim()) {

       query = query.or(
`student_name_bn.ilike.%${searchStudent.value.trim()}%,
student_name_en.ilike.%${searchStudent.value.trim()}%`
);
    }

    const { data, error } = await query;

    if (error) {

        console.error(error);

        return;

    }

    attendanceTable.innerHTML = "";

    if (!data.length) {

        attendanceTable.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                No Students Found
            </td>
        </tr>`;

        return;

    }

    data.forEach(student => {

        attendanceTable.innerHTML += `

<tr>

<td>

<img
src="${student.photo_url || "assets/img/avatar.png"}"
class="student-photo">

</td>

<td>${student.id}</td>

<td>${student.student_name_bn || student.student_name_en}</td>

<td>${student.class_name}</td>

<td>

<input
type="radio"
class="status-radio"
name="attendance_${student.id}"
value="Present"
checked>

</td>

<td>

<input
type="radio"
class="status-radio"
name="attendance_${student.id}"
value="Absent">

</td>

<td>

<input
type="radio"
class="status-radio"
name="attendance_${student.id}"
value="Leave">

</td>

</tr>

`;

    });

}

/* ===========================================
   LOAD BUTTON
=========================================== */

loadStudentsBtn.addEventListener("click", loadStudents);

/* ===========================================
   SAVE ATTENDANCE
=========================================== */

saveAttendanceBtn.addEventListener("click", async () => {

    try {

        const date = attendanceDate.value;

        const { data: students, error } = await db
            .from("students")
            .select("id");

        if (error) throw error;

        for (const student of students) {

            const checked = document.querySelector(
                `input[name="attendance_${student.id}"]:checked`
            );

            if (!checked) continue;

            const record = {
                student_id: student.id,
                attendance_date: date,
                status: checked.value
            };

            // একই দিনের Attendance আগে আছে কিনা
            const { data: existing } = await db
                .from("attendance")
                .select("id")
                .eq("student_id", student.id)
                .eq("attendance_date", date)
                .maybeSingle();

            if (existing) {

                await db
                    .from("attendance")
                    .update({
                        status: record.status
                    })
                    .eq("id", existing.id);

            } else {

                await db
                    .from("attendance")
                    .insert(record);

            }

        }

        alert("Attendance Successfully Saved.");

    } catch (err) {

        console.error(err);

        alert("Attendance Save Failed!");

    }

}); 
/* ===========================================
   LOAD PREVIOUS ATTENDANCE
=========================================== */

async function loadPreviousAttendance() {

    const date = attendanceDate.value;

    const { data } = await db
        .from("attendance")
        .select("*")
        .eq("attendance_date", date);

    if (!data) return;

    data.forEach(item => {

        const radio = document.querySelector(

            `input[name="attendance_${item.student_id}"][value="${item.status}"]`

        );

        if (radio) {

            radio.checked = true;

        }

    });

}

attendanceDate.addEventListener("change", async () => {

    await loadStudents();

    setTimeout(loadPreviousAttendance, 300);

});

loadStudentsBtn.addEventListener("click", () => {

    setTimeout(loadPreviousAttendance, 300);

});
/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

    await loadStudents();

    await loadPreviousAttendance();

});
