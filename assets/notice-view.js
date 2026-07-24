// ======================================
// Notice Details Page
// ======================================

const params = new URLSearchParams(window.location.search);

const noticeId = params.get("id");

if (!noticeId) {

    alert("Notice পাওয়া যায়নি");

    window.location.href = "index.html";

}

// ======================================
// Load Notice
// ======================================

async function loadNotice() {

    const { data, error } = await window.supabaseClient

        .from("notices")

        .select("*")

        .eq("id", noticeId)

        .single();

    if (error) {

        alert("Notice পাওয়া যায়নি");

        window.location.href = "index.html";

        return;

    }

    // =============================
    // Title
    // =============================

    document.getElementById("title").innerText = data.title;

    // =============================
    // Date
    // =============================

    document.getElementById("date").innerHTML =

        `<i class="fa-solid fa-calendar-days"></i>
        ${new Date(data.created_at).toLocaleDateString("en-GB")}`;

    // =============================
    // Description
    // =============================

    document.getElementById("description").innerText =
        data.description;

    // =============================
    // Image
    // =============================

    if (data.image_url) {

        const img = document.getElementById("image");

        img.src = data.image_url;

        img.style.display = "block";

    }

    // =============================
    // PDF
    // =============================

    if (data.pdf_url) {

        document.getElementById("pdfArea").innerHTML = `

        <a
        href="${data.pdf_url}"
        target="_blank"
        class="btn btn-success">

        <i class="fa-solid fa-download"></i>

        Download PDF

        </a>

        `;

    }

    // =============================
    // Badge
    // =============================

    let badge = "";

    if (data.pinned) {

        badge +=

        `<span class="badge bg-warning text-dark me-2">

        📌 Pinned

        </span>`;

    }

    if (data.important) {

        badge +=

        `<span class="badge bg-danger">

        ⭐ Important

        </span>`;

    }

    document.getElementById("badgeArea").innerHTML = badge;

}

loadNotice();
