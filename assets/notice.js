// ======================================
// NOTICE MANAGEMENT SYSTEM V2
// ======================================

let notices = [];
let editNoticeId = null;

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

    loadNotices();

}

checkLogin();

// ======================================
// LOAD NOTICES
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
// RENDER NOTICE TABLE
// ======================================

function renderNoticeTable(list) {

    const table = document.getElementById("noticeTable");

    if (!table) return;

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-4">
                কোনো Notice পাওয়া যায়নি।
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

<br>

<small class="text-muted">

${new Date(notice.created_at).toLocaleDateString("en-GB")}

</small>

</td>

<td>

<span class="badge bg-success">

${notice.category || "সাধারণ"}

</span>

${notice.important
? '<span class="badge bg-danger ms-1">Important</span>'
: ""}

</td>

<td>

${notice.image_url
? `<img src="${notice.image_url}" width="70" class="img-thumbnail">`
: "-"}

</td>

<td>

${notice.pdf_url
? `<a href="${notice.pdf_url}" target="_blank" class="btn btn-sm btn-primary">
<i class="fa-solid fa-file-pdf"></i> PDF
</a>`
: "-"}

</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editNotice(${notice.id})">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm ms-1"
onclick="deleteNotice(${notice.id})">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
// ======================================
// UPLOAD IMAGE
// ======================================

async function uploadNoticeImage(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } = await window.supabaseClient.storage
        .from("notice-images")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {
        console.error(error);
        throw error;
    }

    const { data } = window.supabaseClient.storage
        .from("notice-images")
        .getPublicUrl(fileName);

    return data.publicUrl;

}


// ======================================
// UPLOAD PDF
// ======================================

async function uploadNoticePDF(file) {

    if (!file) return "";

    const fileName =
        Date.now() + "_" + file.name.replace(/\s+/g, "_");

    const { error } = await window.supabaseClient.storage
        .from("notice-pdf")
        .upload(fileName, file, {
            upsert: true
        });

    if (error) {
        console.error(error);
        throw error;
    }

    const { data } = window.supabaseClient.storage
        .from("notice-pdf")
        .getPublicUrl(fileName);

    return data.publicUrl;

} 
// ======================================
// ADD NOTICE
// ======================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

    noticeForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const submitBtn = document.getElementById("submitBtn");

        submitBtn.disabled = true;
        submitBtn.innerHTML = "Publishing...";

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
    throw result.error;
}

alert(
    editNoticeId
        ? "✅ Notice Updated Successfully"
        : "✅ Notice Published Successfully"
);

noticeForm.reset();

editNoticeId = null;

document.getElementById("submitBtn").innerHTML = `
    <i class="fa-solid fa-paper-plane"></i>
    Publish Notice
`;

loadNotices();

            
            if (error) {
                throw error;
            }

            alert("✅ Notice Published Successfully");

            noticeForm.reset();

            loadNotices();

        } catch (err) {

            console.error(err);

            alert("❌ " + err.message);

        } finally {

            submitBtn.disabled = false;

            submitBtn.innerHTML = `
                <i class="fa-solid fa-paper-plane"></i>
                Publish Notice
            `;

        }

    });

}
// ======================================
// EDIT NOTICE
// ======================================

function editNotice(id) {

    const notice = notices.find(item => item.id === id);

    if (!notice) return;

    editNoticeId = id;

    document.getElementById("title").value =
        notice.title;

    document.getElementById("description").value =
        notice.description;

    document.getElementById("category").value =
        notice.category || "সাধারণ";

    document.getElementById("important").checked =
        notice.important;

    document.getElementById("pinned").checked =
        notice.pinned;

    document.getElementById("submitBtn").innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Update Notice
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
// ======================================
// DELETE NOTICE
// ======================================

async function deleteNotice(id) {

    const confirmDelete = confirm(
        "আপনি কি এই Notice Delete করতে চান?"
    );

    if (!confirmDelete) return;

    const { error } = await window.supabaseClient
        .from("notices")
        .delete()
        .eq("id", id);

    if (error) {

        alert("❌ " + error.message);

        return;

    }

    alert("🗑️ Notice Deleted Successfully");

    loadNotices();

}









