// ======================================
// TEACHER FORM SYSTEM V1
// ======================================

const teacherForm =
document.getElementById("teacherForm");

// ======================================
// PHOTO PREVIEW
// ======================================

const teacherPhoto =
document.getElementById("teacher_photo");

if (teacherPhoto) {

    teacherPhoto.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            document
            .getElementById("teacherPreview")
            .src = e.target.result;

        };

        reader.readAsDataURL(file);

    });

}

// ======================================
// PHOTO UPLOAD
// ======================================

async function uploadTeacherPhoto(file){

    if(!file) return "";

    const fileName =
    Date.now() + "_" +
    file.name.replace(/\s+/g,"_");

    const { error } =
    await window.supabaseClient.storage
    .from("teacher-photos")
    .upload(fileName,file,{
        upsert:true
    });

    if(error) throw error;

    const { data } =
    window.supabaseClient.storage
    .from("teacher-photos")
    .getPublicUrl(fileName);

    return data.publicUrl;

}

// ======================================
// SAVE TEACHER
// ======================================

if(teacherForm){

teacherForm.addEventListener("submit",async function(e){

    e.preventDefault();

    const btn =
    document.getElementById("teacherSubmit");

    btn.disabled = true;

    btn.innerHTML = "Saving...";

    try{

        let photo_url = "";

        const photo =
        document.getElementById("teacher_photo").files[0];

        if(photo){

            photo_url =
            await uploadTeacherPhoto(photo);

        }

        const { error } =
        await window.supabaseClient
        .from("teachers")
        .insert([{

            name:
            document.getElementById("teacher_name").value,

            designation:
            document.getElementById("designation").value,

            mobile:
            document.getElementById("teacher_mobile").value,

            email:
            document.getElementById("teacher_email").value,

            qualification:
            document.getElementById("qualification").value,

            address:
            document.getElementById("teacher_address").value,

            status:
            document.getElementById("teacher_status").value,

            photo_url

        }]);

        if(error) throw error;

        alert("✅ Teacher Saved Successfully");

        teacherForm.reset();

        document.getElementById("teacherPreview").src =
        "https://placehold.co/180x180?text=Teacher";

    }

    catch(err){

        alert(err.message);

    }

    finally{

        btn.disabled = false;

        btn.innerHTML =
        '<i class="fa fa-save"></i> Save Teacher';

    }

});

}
