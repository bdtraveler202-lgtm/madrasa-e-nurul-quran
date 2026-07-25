// ======================================
// ADMISSION SYSTEM V2
// ======================================

const admissionForm = document.getElementById("admissionForm");

// ======================================
// AUTO ADMISSION DATE
// ======================================

const admissionDate = document.getElementById("admission_date");

if (admissionDate) {

    admissionDate.value =
        new Date().toISOString().split("T")[0];

}

// ======================================
// AUTO STUDENT ID
// ======================================

async function generateStudentId() {

    const { count } =
        await window.supabaseClient
        .from("students")
        .select("*", {
            count: "exact",
            head: true
        });

    const total = (count || 0) + 1;

    const studentId =
        "STU-2026-" +
        String(total).padStart(4, "0");

    document.getElementById("student_id").value =
        studentId;

}

generateStudentId();

// ======================================
// PHOTO PREVIEW
// ======================================

const photoInput =
document.getElementById("photo");

if (photoInput) {

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        document
        .getElementById("photoPreview")
        .src = e.target.result;

    };

    reader.readAsDataURL(file);

});

}
// ======================================
// UPLOAD STUDENT PHOTO
// ======================================

async function uploadStudentPhoto(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } =
        await window.supabaseClient.storage
        .from("student-photos")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {

        console.error(error);

        throw error;

    }

    const { data } =
        window.supabaseClient.storage
        .from("student-photos")
        .getPublicUrl(fileName);

    return data.publicUrl;

} 
// ======================================
// SAVE STUDENT
// ======================================

if (admissionForm) {

admissionForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const btn =
    document.getElementById("submitBtn");

    btn.disabled = true;

    btn.innerHTML = "Saving...";

    try {

        const student_id =
        document.getElementById("student_id").value;

        const full_name =
        document.getElementById("full_name").value.trim();

        const father_name =
        document.getElementById("father_name").value.trim();

        const mother_name =
        document.getElementById("mother_name").value.trim();

        const mobile =
        document.getElementById("mobile").value.trim();

        const guardian_mobile =
        document.getElementById("guardian_mobile").value.trim();

        const gender =
        document.getElementById("gender").value;

        const date_of_birth =
        document.getElementById("date_of_birth").value;

        const student_class =
        document.getElementById("class").value;

        const previous_school =
        document.getElementById("previous_school").value.trim();

        const address =
        document.getElementById("address").value.trim();

        const admission_date =
        document.getElementById("admission_date").value;

        const status =
        document.getElementById("status").value;

        const photoFile =
        document.getElementById("photo").files[0];

        let photo_url = "";

        if(photoFile){

            photo_url =
            await uploadStudentPhoto(photoFile);

        }

        const { error } =
        await window.supabaseClient
        .from("students")
        .insert([{

            student_id,
            full_name,
            father_name,
            mother_name,
            mobile,
            guardian_mobile,
            gender,
            date_of_birth,
            class: student_class,
            previous_school,
            address,
            admission_date,
            status,
            photo_url

        }]);

        if(error){

            throw error;

        }

        alert("✅ Admission Submitted Successfully");

        admissionForm.reset();

        generateStudentId();

        document.getElementById("photoPreview").src =
        "https://placehold.co/180x180?text=Photo";

    }

    catch(err){

        console.error(err);

        alert("❌ " + err.message);

    }

    finally{

        btn.disabled = false;

        btn.innerHTML =
        '<i class="fa-solid fa-paper-plane"></i> ভর্তি আবেদন জমা দিন';

    }

});

}





