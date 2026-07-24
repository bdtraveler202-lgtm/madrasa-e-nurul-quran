alert("notice.js Loaded");
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

                ${notice.image_url

                    ? `<img src="${notice.image_url}" width="70">`

                    : "-"}

            </td>

            <td>

                ${notice.pdf_url

                    ? `<a href="${notice.pdf_url}" target="_blank" class="btn btn-primary btn-sm">PDF</a>`

                    : "-"}

            </td>

            <td>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteNotice(${notice.id})">

                    Delete

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
            const { error } = await window.supabaseClient

                .from("notices")

                .insert([{

                    title: title,
                    description: description,

                    image_url: image_url,
                    pdf_url: pdf_url,

                    important: important,
                    pinned: pinned

                }]);

            if (error) {

                console.error(error);

                alert("❌ " + error.message);

                return;

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


