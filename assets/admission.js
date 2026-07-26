// ======================================
// ADMISSION SYSTEM V3
// ======================================

const admissionForm = document.getElementById("admissionForm");

let editStudentId = null;
let oldPhoto = "";

const params = new URLSearchParams(window.location.search);

editStudentId = params.get("edit");

// ======================================
// AUTO DATE
// ======================================

const admissionDate =
document.getElementById("admission_date");

if(admissionDate && !editStudentId){

    admissionDate.value =
    new Date().toISOString().split("T")[0];

}

// ======================================
// STUDENT ID
// ======================================

async function generateStudentId(){

    if(editStudentId) return;

    const { count } =
    await window.supabaseClient
    .from("students")
    .select("*",{

        count:"exact",
        head:true

    });

    const total =
    (count || 0)+1;

    document.getElementById("student_id").value =

    "STU-2026-"+

    String(total).padStart(4,"0");

}

generateStudentId();


// ======================================
// PHOTO PREVIEW
// ======================================

const photoInput =
document.getElementById("photo");

if(photoInput){

photoInput.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(e){

const preview=
document.getElementById("photoPreview");

preview.src=e.target.result;

preview.classList.remove("d-none");

};

reader.readAsDataURL(file);

});

} 
// ======================================
// UPLOAD PHOTO
// ======================================

async function uploadStudentPhoto(file){

    if(!file) return oldPhoto;

    const fileName =
    Date.now()+"_"+file.name.replace(/\s+/g,"_");

    const { error } =
    await window.supabaseClient.storage
    .from("student-photos")
    .upload(fileName,file,{
        upsert:true
    });

    if(error){

        throw error;

    }

    const { data } =
    window.supabaseClient.storage
    .from("student-photos")
    .getPublicUrl(fileName);

    return data.publicUrl;

}

// ======================================
// LOAD STUDENT FOR EDIT
// ======================================

async function loadStudentForEdit(){

    if(!editStudentId) return;

    const { data,error } =
    await window.supabaseClient
    .from("students")
    .select("*")
    .eq("id",editStudentId)
    .single();

    if(error){

        alert(error.message);

        return;

    }

    oldPhoto =
    data.photo_url || "";

    document.getElementById("student_id").value =
    data.student_id || "";

    document.getElementById("full_name").value =
    data.full_name || "";

    document.getElementById("father_name").value =
    data.father_name || "";

    document.getElementById("mother_name").value =
    data.mother_name || "";

    document.getElementById("mobile").value =
    data.mobile || "";

    document.getElementById("guardian_mobile").value =
    data.guardian_mobile || "";

    document.getElementById("gender").value =
    data.gender || "";

    document.getElementById("date_of_birth").value =
    data.date_of_birth || "";

    document.getElementById("class").value =
    data.class || "";

    document.getElementById("previous_school").value =
    data.previous_school || "";

    document.getElementById("address").value =
    data.address || "";

    document.getElementById("admission_date").value =
    data.admission_date || "";

    document.getElementById("status").value =
    data.status || "Pending";

    if(oldPhoto){

        const preview =
        document.getElementById("photoPreview");

        preview.src = oldPhoto;

        preview.classList.remove("d-none");

    }

    const btn =
    document.getElementById("submitBtn");

    if(btn){

        btn.innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Update Student';

    }

}

loadStudentForEdit();
// ======================================
// SAVE / UPDATE STUDENT
// ======================================

if (admissionForm) {

admissionForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const btn =
    document.getElementById("submitBtn");

    btn.disabled = true;

    btn.innerHTML =
    editStudentId ? "Updating..." : "Saving...";

    try{
if(!validateStudent()){

    btn.disabled = false;

    btn.innerHTML =
    editStudentId
    ? "Update Student"
    : "Submit";

    return;

}
        const photoFile =
        document.getElementById("photo").files[0];

        const photo_url =
        await uploadStudentPhoto(photoFile);
const duplicateId =
await checkDuplicateStudentId(
document.getElementById("student_id").value
);

if(duplicateId){

    alert("Student ID Already Exists");

    btn.disabled = false;

    return;

}

const duplicateMobile =
await checkDuplicateMobile(
document.getElementById("mobile").value
);

if(duplicateMobile){

    alert("Mobile Number Already Exists");

    btn.disabled = false;

    return;

}
        const studentData = {

            student_id:
            document.getElementById("student_id").value,

            full_name:
            document.getElementById("full_name").value.trim(),

            father_name:
            document.getElementById("father_name").value.trim(),

            mother_name:
            document.getElementById("mother_name").value.trim(),

            mobile:
            document.getElementById("mobile").value.trim(),

            guardian_mobile:
            document.getElementById("guardian_mobile").value.trim(),

            gender:
            document.getElementById("gender").value,

            date_of_birth:
            document.getElementById("date_of_birth").value,

            class:
            document.getElementById("class").value,

            previous_school:
            document.getElementById("previous_school").value.trim(),

            address:
            document.getElementById("address").value.trim(),

            admission_date:
            document.getElementById("admission_date").value,

            status:
            document.getElementById("status").value,

            photo_url

        };

        let result;

        if(editStudentId){

            result =
            await window.supabaseClient
            .from("students")
            .update(studentData)
            .eq("id",editStudentId);

        }else{

            result =
            await window.supabaseClient
            .from("students")
            .insert([studentData]);

        }

        if(result.error){

            throw result.error;

        }

        alert(

            editStudentId

            ?

            "✅ Student Updated Successfully"

            :

            "✅ Admission Submitted Successfully"

        );

        if(editStudentId){

            window.location.href =
            "students.html";

            return;

        }

        admissionForm.reset();

        generateStudentId();

        document.getElementById("photoPreview").src =
        "https://placehold.co/180x180?text=Photo";

        document
        .getElementById("photoPreview")
        .classList.add("d-none");

    }

    catch(err){

        console.error(err);

        alert("❌ " + err.message);

    }

    finally{

        btn.disabled = false;

        btn.innerHTML =

        editStudentId

        ?

        '<i class="fa-solid fa-floppy-disk"></i> Update Student'

        :

        '<i class="fa-solid fa-paper-plane"></i> ভর্তি আবেদন জমা দিন';

    }

});

}


// ======================================
// FINAL VALIDATION
// ======================================

function validateStudent(){

    const full_name =
    document.getElementById("full_name").value.trim();

    const father_name =
    document.getElementById("father_name").value.trim();

    const mobile =
    document.getElementById("mobile").value.trim();

    const studentClass =
    document.getElementById("class").value;

    if(full_name===""){

        alert("শিক্ষার্থীর নাম লিখুন");

        return false;

    }

    if(father_name===""){

        alert("পিতার নাম লিখুন");

        return false;

    }

    if(studentClass===""){

        alert("শ্রেণী নির্বাচন করুন");

        return false;

    }

    if(mobile.length!==11){

        alert("সঠিক মোবাইল নম্বর লিখুন");

        return false;

    }

    return true;

}

// ======================================
// CHECK DUPLICATE STUDENT ID
// ======================================

async function checkDuplicateStudentId(studentId){

    if(editStudentId) return false;

    const { data,error } =
    await window.supabaseClient
    .from("students")
    .select("student_id")
    .eq("student_id",studentId);

    if(error){

        console.error(error);

        return false;

    }

    return data.length>0;

}

// ======================================
// CHECK DUPLICATE MOBILE
// ======================================

async function checkDuplicateMobile(mobile){

    if(editStudentId) return false;

    const { data,error } =
    await window.supabaseClient
    .from("students")
    .select("mobile")
    .eq("mobile",mobile);

    if(error){

        console.error(error);

        return false;

    }

    return data.length>0;

}

// ======================================
// RESET FORM
// ======================================

function resetAdmissionForm(){

    admissionForm.reset();

    generateStudentId();

    const preview =
    document.getElementById("photoPreview");

    if(preview){

        preview.src =
        "https://placehold.co/180x180?text=Photo";

        preview.classList.add("d-none");

    }

}

// ======================================
// SUCCESS REDIRECT
// ======================================

function successRedirect(){

    setTimeout(function(){

        window.location.href =
        "students.html";

    },800);

}

// ======================================
// PAGE TITLE CHANGE
// ======================================

if(editStudentId){

    document.title =
    "Edit Student";

}else{

    document.title =
    "New Admission";

}

console.log(
"✅ Admission System V3 Loaded Successfully"
);


