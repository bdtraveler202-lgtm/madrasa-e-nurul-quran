// ======================================
// Notice Management System
// ======================================

let notices = [];

// ======================================
// Login Check
// ======================================

async function checkLogin() {

    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    if (!data.session) {

        alert("❌ আপনি Login করেননি!");

        window.location.href = "login.html";

        return;

    }

    loadNotices();

}

checkLogin();


// ======================================
// Load Notices
// ======================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient

        .from("notices")

        .select("*")

        .order("pinned", { ascending: false })

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    notices = data || [];

    renderNotices();

}


// ======================================
// Render Table
// ======================================

function renderNotices() {

    const table = document.getElementById("noticeTable");

    table.innerHTML = "";

    if (notices.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="7" class="text-center">

                কোনো Notice পাওয়া যায়নি

            </td>

        </tr>

        `;

        return;

    }

    notices.forEach(notice => {

        table.innerHTML += `

        <tr>

            <td>${notice.id}</td>

            <td>

                ${notice.pinned ? "📌 " : ""}

                ${notice.title}

            </td>

            <td>

                ${notice.description}

            </td>

            <td>

                ${notice.important

                    ? '<span class="badge bg-danger">Important</span>'

                    : '<span class="badge bg-secondary">Normal</span>'}

            </td>

<td>
    ${
        notice.image_url
        ? `<img src="${notice.image_url}" width="80" class="img-thumbnail">`
        : "-"
    }
</td>

<td>
    ${
        notice.pdf_url
        ? `<a href="${notice.pdf_url}" target="_blank" download class="btn btn-primary btn-sm">
            <i class="fa fa-download"></i> PDF
           </a>`
        : "-"
    }
</td>

<td>
    ${
        notice.important
        ? `<span class="badge bg-danger">Important</span>`
        : "-"
    }
</td> 

<td>
    ${notice.pinned ? "📌 " : ""}
    ${notice.title}
</td>
           
<td>

<button
class="btn btn-warning btn-sm"
onclick="editNotice(${notice.id})">

<i class="fa fa-edit"></i>

Edit

</button>

</td>


class="btn btn-danger btn-sm"
onclick="deleteNotice(${notice.id})">

<i class="fa fa-trash"></i>

Delete

</button>

</td>

           
        `;

    });

} 
// ======================================
// Upload Notice Image
// ======================================

async function uploadNoticeImage(file) {

    if (!file) return "";

    const fileName = Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } = await window.supabaseClient.storage
        .from("notice-images")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {
        console.error("Image Upload Error:", error);
        alert("❌ Image Upload Failed\n" + error.message);
        return "";
    }

    const { data } = window.supabaseClient.storage
        .from("notice-images")
        .getPublicUrl(fileName);

    return data.publicUrl;
}


// ======================================
// Upload Notice PDF
// ======================================

async function uploadNoticePDF(file) {

    if (!file) return "";

    const fileName = Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } = await window.supabaseClient.storage
        .from("notice-pdf")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {
        console.error("PDF Upload Error:", error);
        alert("❌ PDF Upload Failed\n" + error.message);
        return "";
    }

    const { data } = window.supabaseClient.storage
        .from("notice-pdf")
        .getPublicUrl(fileName);

    return data.publicUrl;
} 
// ======================================
// Add Notice
// ======================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

    noticeForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn = noticeForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Uploading...";

        try {

            const title = document.getElementById("title").value.trim();
            const description = document.getElementById("description").value.trim();

            const important = document.getElementById("important").checked;
            const pinned = document.getElementById("pinned").checked;

            const imageFile = document.getElementById("noticeImage").files[0];
            const pdfFile = document.getElementById("noticePDF").files[0];

            let image_url = "";
            let pdf_url = "";

            // Upload Image
            if (imageFile) {
                image_url = await uploadNoticeImage(imageFile);
            }

            // Upload PDF
            if (pdfFile) {
                pdf_url = await uploadNoticePDF(pdfFile);
            }

            // Save Database
           
        } catch (err) {

            console.error(err);

            alert("❌ " + err.message);

        } finally {

            submitBtn.disabled = false; 

          // Save / Update

let error;

if (editNoticeId) {

    ({ error } = await window.supabaseClient
        .from("notices")
        .update({
            title,
            description,
            important,
            pinned,
            image_url,
            pdf_url
        })
        .eq("id", editNoticeId));

} else {

    ({ error } = await window.supabaseClient
        .from("notices")
        .insert([{
            title,
            description,
            important,
            pinned,
            image_url,
            pdf_url
        }]));

}

if (error) {

    alert(error.message);

    return;

}

alert(editNoticeId
    ? "✅ Notice Updated Successfully"
    : "✅ Notice Published Successfully");

noticeForm.reset();

editNoticeId = null;

document.getElementById("submitBtn").innerHTML =
'<i class="fa fa-plus"></i> Add Notice';

loadNotices();  

            submitBtn.innerHTML = `
                <i class="fa-solid fa-paper-plane"></i>
                Publish Notice
            `;

        }

    });

}
// ======================================
// Edit Notice
// ======================================

function editNotice(id){

const notice = notices.find(n => n.id == id);

if(!notice) return;

editNoticeId = id;

document.getElementById("title").value = notice.title;

document.getElementById("description").value = notice.description;

document.getElementById("important").checked = notice.important;

document.getElementById("pinned").checked = notice.pinned;

document.getElementById("submitBtn").innerHTML =
'<i class="fa fa-save"></i> Update Notice';

window.scrollTo({
top:0,
behavior:"smooth"
});

}  

