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
