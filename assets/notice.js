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

