// ==========================================
// NOTICE MANAGEMENT SYSTEM
// Part 1
// ==========================================

let notices = [];
let editNoticeId = null;

// ==========================================
// Login Check
// ==========================================

async function checkLogin() {

    const { data } = await window.supabaseClient.auth.getSession();

    if (!data.session) {

        alert("❌ Please Login First");

        window.location.href = "login.html";

        return;

    }

    loadNotices();

}

checkLogin();


// ==========================================
// Load Notices
// ==========================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient

        .from("notices")

        .select("*")

        .order("pinned", { ascending: false })

        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    notices = data || [];

    renderNoticeTable(notices);

}


// ==========================================
// Render Notice Table
// ==========================================

function renderNoticeTable(list) {

    const table = document.getElementById("noticeTable");

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="8" class="text-center">
                No Notice Found
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

                ${notice.important

                    ? '<span class="badge bg-danger">Important</span>'

                    : '-'}

            </td>

            <td>

                ${notice.image_url

                    ? `<img src="${notice.image_url}" width="60">`

                    : '-'}

            </td>

            <td>

                ${notice.pdf_url

                    ? `<a href="${notice.pdf_url}" target="_blank" class="btn btn-sm btn-primary">PDF</a>`

                    : '-'}

            </td>

            <td>

                <button

                class="btn btn-warning btn-sm"

                onclick="editNotice(${notice.id})">

                Edit

                </button>

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
// ==========================================
// Upload Image
// ==========================================

async function uploadNoticeImage(file) {

    if (!file) return "";

    const fileName = Date.now() + "_" + file.name;

    const { error } = await window.supabaseClient.storage
        .from("notice-images")
        .upload(fileName, file);

    if (error) {

        alert("Image Upload Failed");

        throw error;

    }

    const { data } = window.supabaseClient.storage
        .from("notice-images")
        .getPublicUrl(fileName);

    return data.publicUrl;

}


// ==========================================
// Upload PDF
// ==========================================

async function uploadNoticePDF(file) {

    if (!file) return "";

    const fileName = Date.now() + "_" + file.name;

    const { error } = await window.supabaseClient.storage
        .from("notice-pdf")
        .upload(fileName, file);

    if (error) {

        alert("PDF Upload Failed");

        throw error;

    }

    const { data } = window.supabaseClient.storage
        .from("notice-pdf")
        .getPublicUrl(fileName);

    return data.publicUrl;

}


// ==========================================
// Add Notice
// ==========================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

noticeForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const title = document.getElementById("title").value.trim();

    const description = document.getElementById("description").value.trim();

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

    const { error } = await window.supabaseClient

        .from("notices")

        .insert([{

            title,

            description,

            important,

            pinned,

            image_url,

            pdf_url

        }]);

    if (error) {

        alert(error.message);

        return;

    }

    alert("✅ Notice Published Successfully");

    noticeForm.reset();

    loadNotices();

});

} 


