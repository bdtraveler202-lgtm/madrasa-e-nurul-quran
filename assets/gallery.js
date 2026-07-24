// ======================================
// GALLERY MANAGEMENT V2
// ======================================

let galleries = [];
let editGalleryId = null;

// ======================================
// LOGIN CHECK
// ======================================

async function checkLogin() {

    const { data, error } =
        await window.supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        return;

    }

    if (!data.session) {

        alert("❌ Please login first");

        window.location.href = "login.html";

        return;

    }

    loadGallery();

}

checkLogin();

// ======================================
// LOAD GALLERY
// ======================================

async function loadGallery() {

    const { data, error } = await window.supabaseClient
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    galleries = data || [];

    renderGalleryTable(galleries);

}
// ======================================
// RENDER GALLERY TABLE
// ======================================

function renderGalleryTable(list) {

    const table = document.getElementById("galleryTable");

    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                কোনো ছবি পাওয়া যায়নি।
            </td>
        </tr>
        `;

        return;

    }

    list.forEach(item => {

        table.innerHTML += `

<tr>

<td>${item.id}</td>

<td>

<img
src="${item.image_url}"
class="gallery-img">

</td>

<td>${item.title}</td>

<td>${item.category}</td>

<td>

<button
class="btn btn-warning btn-sm"
disabled>

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm ms-1"
disabled>

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

} 
// ======================================
// UPLOAD GALLERY IMAGE
// ======================================

async function uploadGalleryImage(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");


    const { error } =
        await window.supabaseClient.storage
        .from("gallery-images")
        .upload(fileName, file, {
            upsert:true
        });


    if (error) {

        console.error(error);

        throw error;

    }


    const { data } =
        window.supabaseClient.storage
        .from("gallery-images")
        .getPublicUrl(fileName);


    return data.publicUrl;

}
// ======================================
// ADD GALLERY IMAGE
// ======================================

const galleryForm =
document.getElementById("galleryForm");


if (galleryForm) {


galleryForm.addEventListener("submit", async function(e){


    e.preventDefault();


    const btn =
    document.getElementById("submitBtn");


    btn.disabled = true;

    btn.innerHTML = "Uploading...";


    try {


        const title =
        document.getElementById("title").value.trim();


        const category =
        document.getElementById("category").value;


        const imageFile =
        document.getElementById("galleryImage").files[0];


        const image_url =
        await uploadGalleryImage(imageFile);



        const { error } =
        await window.supabaseClient
        .from("gallery")
        .insert([{

            title,
            category,
            image_url

        }]);


        if(error){

            throw error;

        }


        alert("✅ Image Uploaded Successfully");


        galleryForm.reset();


        loadGallery();



    } catch(err){


        console.error(err);


        alert("❌ " + err.message);



    } finally{


        btn.disabled = false;


        btn.innerHTML =
        "Upload Image";


    }


});


}


