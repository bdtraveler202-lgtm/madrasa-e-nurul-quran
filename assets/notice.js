// ======================================
// NOTICE MANAGEMENT SYSTEM
// Part 1
// ======================================

let notices = [];
let editNoticeId = null;

// ======================================
// Login Check
// ======================================

async function checkLogin() {

    const { data, error } =
        await window.supabaseClient.auth.getSession();

    if (error) {

        console.error(error);

        alert("Login Error");

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

    const { data, error } =
        await window.supabaseClient

        .from("notices")

        .select("*")

        .order("pinned", { ascending: false })

        .order("important", { ascending: false })

        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    notices = data || [];

    renderNoticeTable(notices);

} 
// ======================================
// Render Notice Table
// ======================================

function renderNoticeTable(list) {

    const table = document.getElementById("noticeTable");

    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                কোনো Notice পাওয়া যায়নি
            </td>
        </tr>
        `;

        return;

    }

    list.forEach(notice => {

        table.innerHTML += `

<tr>

<td>${notice.id}</td>

<td>

${notice.pinned ? "📌 " : ""}

${notice.title}

</td>

<td>${notice.description}</td>

<td>

${notice.category ?? "সাধারণ"}

</td>

<td>

${notice.image_url

? `<img src="${notice.image_url}" width="70" class="img-thumbnail">`

: "-"}

</td>

<td>

${notice.pdf_url

? `<a href="${notice.pdf_url}" target="_blank" class="btn btn-primary btn-sm">
<i class="fa fa-file-pdf"></i>
PDF
</a>`

: "-"}

</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editNotice(${notice.id})">

<i class="fa fa-edit"></i>

</button>

<button
class="btn btn-danger btn-sm ms-1"
onclick="deleteNotice(${notice.id})">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
// ======================================
// Upload Notice Image
// ======================================

async function uploadNoticeImage(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" +
        file.name.replace(/\s+/g, "_");

    const { error } =
        await window.supabaseClient.storage
        .from("notice-images")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {

        console.error(error);

        alert("❌ Image Upload Failed");

        throw error;

    }

    const { data } =
        window.supabaseClient.storage
        .from("notice-images")
        .getPublicUrl(fileName);

    return data.publicUrl;

}


// ======================================
// Upload Notice PDF
// ======================================

async function uploadNoticePDF(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" +
        file.name.replace(/\s+/g, "_");

    const { error } =
        await window.supabaseClient.storage
        .from("notice-pdf")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {

        console.error(error);

        alert("❌ PDF Upload Failed");

        throw error;

    }

    const { data } =
        window.supabaseClient.storage
        .from("notice-pdf")
        .getPublicUrl(fileName);

    return data.publicUrl;

}
// ======================================
// Add / Update Notice
// ======================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

    noticeForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn = document.getElementById("submitBtn");

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Saving...";

        try {

            const title = document.getElementById("title").value.trim();

            const description = document.getElementById("description").value.trim();

            const category = document.getElementById("category").value;

            const important = document.getElementById("important").checked;

            const pinned = document.getElementById("pinned").checked;

            const imageFile = document.getElementById("noticeImage").files[0];

            const pdfFile = document.getElementById("noticePDF").files[0];

            let image_url = "";
            let pdf_url = "";

            if (imageFile) {

                image_url = await uploadNoticeImage(imageFile);

            }

            if (pdfFile) {

                pdf_url = await uploadNoticePDF(pdfFile);

            }

            let result;

            if (editNoticeId) {

                result = await window.supabaseClient
                    .from("notices")
                    .update({
                        title,
                        description,
                        category,
                        important,
                        pinned,
                        image_url,
                        pdf_url
                    })
                    .eq("id", editNoticeId);

            } else {

                result = await window.supabaseClient
                    .from("notices")
                    .insert([{
                        title,
                        description,
                        category,
                        important,
                        pinned,
                        image_url,
                        pdf_url
                    }]);

            }

            if (result.error) {

                alert(result.error.message);

                return;

            }

            alert(
                editNoticeId
                    ? "✅ Notice Updated Successfully"
                    : "✅ Notice Published Successfully"
            );

            noticeForm.reset();

            editNoticeId = null;

            submitBtn.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Publish Notice';

            loadNotices();

        } catch (err) {

            console.error(err);

            alert("❌ " + err.message);

        } finally {

            submitBtn.disabled = false;

        }

    });

}
// ======================================
// Edit Notice
// ======================================

function editNotice(id) {

    const notice = notices.find(n => n.id === id);

    if (!notice) return;

    editNoticeId = id;

    document.getElementById("title").value = notice.title || "";

    document.getElementById("description").value = notice.description || "";

    document.getElementById("category").value =
        notice.category || "সাধারণ";

    document.getElementById("important").checked =
        notice.important || false;

    document.getElementById("pinned").checked =
        notice.pinned || false;

    document.getElementById("submitBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Update Notice
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}






