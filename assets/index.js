// ======================================
// HOME PAGE NOTICE BOARD
// ======================================

async function loadNoticeBoard() {

    const board = document.getElementById("noticeBoard");

    if (!board) return;

    board.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-success"></div>
            <p class="mt-3">নোটিশ লোড হচ্ছে...</p>
        </div>
    `;

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .order("pinned", { ascending: false })
        .order("important", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        board.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    ❌ নোটিশ লোড করা যায়নি
                </div>
            </div>
        `;

        return;

    }

    if (!data || data.length === 0) {

        board.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    কোনো নোটিশ পাওয়া যায়নি।
                </div>
            </div>
        `;

        return;

    }

    board.innerHTML = "";

    data.forEach(notice => {

        board.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card shadow-sm border-0 h-100">

${notice.image_url ?

`<img src="${notice.image_url}"
class="card-img-top"
style="height:220px;object-fit:cover;">`

: ""}

<div class="card-body">

<div class="mb-2">

${notice.pinned ?

`<span class="badge bg-warning text-dark me-2">
📌 Pinned
</span>`

: ""}

${notice.important ?

`<span class="badge bg-danger">
⭐ Important
</span>`

: ""}

</div>

<h5 class="fw-bold">

${notice.title}

</h5>

<p class="text-muted small">

<i class="fa-solid fa-calendar-days"></i>

${new Date(notice.created_at).toLocaleDateString("en-GB")}

</p>

<p>

${notice.description.length > 150

? notice.description.substring(0,150) + "..."

: notice.description}

</p>

</div>

<div class="card-footer bg-white border-0">

${notice.pdf_url ?

`<a href="${notice.pdf_url}"
target="_blank"
class="btn btn-success btn-sm">

<i class="fa-solid fa-download"></i>

PDF

</a>`

: ""}

<a
href="notice-view.html?id=${notice.id}"
class="btn btn-primary btn-sm ms-2">

<i class="fa-solid fa-eye"></i>

Read More

</a>

</div>

</div>

</div>

`;

    });

}

loadNoticeBoard();
// ======================================
// HOME PAGE LATEST NOTICES
// ======================================

async function loadLatestNotices() {

    const board = document.getElementById("latestNoticeBoard");

    if (!board) return;

    board.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-success"></div>
            <p class="mt-3">নোটিশ লোড হচ্ছে...</p>
        </div>
    `;

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .order("pinned", { ascending: false })
        .order("important", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {

        console.error(error);

        board.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    ❌ Notice Load Failed
                </div>
            </div>
        `;

        return;

    }

    if (!data || data.length === 0) {

        board.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    কোনো নোটিশ পাওয়া যায়নি।
                </div>
            </div>
        `;

        return;

    }

    board.innerHTML = "";

    data.forEach(notice => {

        board.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card shadow-sm border-0 h-100">

${notice.image_url ? `
<img src="${notice.image_url}"
class="card-img-top"
style="height:220px;object-fit:cover;">
` : ""}

<div class="card-body">

<div class="mb-2">

${notice.pinned ? `
<span class="badge bg-warning text-dark">
📌 Pinned
</span>
` : ""}

${notice.important ? `
<span class="badge bg-danger ms-1">
⭐ Important
</span>
` : ""}

</div>

<h5 class="fw-bold">

${notice.title}

</h5>

<p class="text-muted small">

<i class="fa-solid fa-calendar-days"></i>

${new Date(notice.created_at).toLocaleDateString("en-GB")}

</p>

<p>

${notice.description.length > 120
? notice.description.substring(0,120) + "..."
: notice.description}

</p>

</div>

<div class="card-footer bg-white border-0">

${notice.pdf_url ? `
<a href="${notice.pdf_url}"
target="_blank"
class="btn btn-success btn-sm">

<i class="fa-solid fa-file-pdf"></i>

PDF

</a>
` : ""}

<a href="notice-view.html?id=${notice.id}"
class="btn btn-primary btn-sm ms-2">

<i class="fa-solid fa-eye"></i>

Read More

</a>

</div>

</div>

</div>

`;

    });

}

loadLatestNotices();
