// ======================================
// Notice Management System
// Part 1
// ======================================

// Global Variables

let notices = [];

let editNoticeId = null;

// ======================================
// Check Login
// ======================================

window.supabaseClient.auth.getSession().then(({ data }) => {

    if (!data.session) {

        alert("❌ আপনি Login করেননি!");

        window.location.href = "login.html";

        return;

    }

    loadNotices();

});

// ======================================
// Load Notices
// ======================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient

        .from("notices")

        .select("*")

        .order("pinned", { ascending: false })

        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        alert("Notice Load Failed!");

        return;

    }

    notices = data;

    renderNoticeTable(notices);

}

// ======================================
// Render Notice Table
// ======================================

function renderNoticeTable(list) {

    const table = document.getElementById("noticeTable");

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="8" class="text-center">

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

            <td>

                ${notice.important

                    ? '<span class="badge bg-danger">Important</span>'

                    : "-"}

            </td>

            <td>

                ${notice.created_at

                    ? new Date(notice.created_at).toLocaleDateString()

                    : "-"}

            </td>

            <td>

                ${notice.downloads || 0}

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
// Add Notice
// ======================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

noticeForm.addEventListener("submit", async function(e){

e.preventDefault();

const title=document.getElementById("title").value.trim();

const description=document.getElementById("description").value.trim();

const important=document.getElementById("important").checked;

const pinned=document.getElementById("pinned").checked;

const imageFile=document.getElementById("noticeImage").files[0];

const pdfFile=document.getElementById("noticePDF").files[0];

let image_url="";

let pdf_url="";

if(title===""){

alert("Notice Title লিখুন");

return;

}

// ======================================
// Upload Image
// ======================================

if(imageFile){

const imageName=Date.now()+"_"+imageFile.name;

const {error:imageError}=await window.supabaseClient.storage

.from("notice-images")

.upload(imageName,imageFile);

if(imageError){

alert(imageError.message);

return;

}

const {data:imageData}=window.supabaseClient.storage

.from("notice-images")

.getPublicUrl(imageName);

image_url=imageData.publicUrl;

}

// ======================================
// Upload PDF
// ======================================

if(pdfFile){

const pdfName=Date.now()+"_"+pdfFile.name;

const {error:pdfError}=await window.supabaseClient.storage

.from("notice-pdf")

.upload(pdfName,pdfFile);

if(pdfError){

alert(pdfError.message);

return;

}

const {data:pdfData}=window.supabaseClient.storage

.from("notice-pdf")

.getPublicUrl(pdfName);

pdf_url=pdfData.publicUrl;

} 
                            
