// ======================================
// PUBLIC NOTICE BOARD
// assets/notices.js
// ======================================

async function loadNotices() {

    const noticeContainer = document.getElementById("noticeContainer");

    if (!noticeContainer) return;

    noticeContainer.innerHTML = `
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

        noticeContainer.innerHTML = `
            <div class="alert alert-danger">
                ❌ Notice Load Failed
            </div>
        `;

        console.error(error);
        return;
    }

    if (!data || data.length === 0) {

        noticeContainer.innerHTML = `
            <div class="alert alert-warning">
                কোনো নোটিশ পাওয়া যায়নি।
            </div>
        `;

        return;
    }

    noticeContainer.innerHTML = "";

    data.forEach(notice => {

        noticeContainer.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card shadow h-100 border-0">

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
<span class="badge bg-danger">
⭐ Important
</span>
` : ""}

</div>

<h5 class="fw-bold">
${notice.title}
</h5>

<p class="text-muted">

<i class="fa-solid fa-calendar-days"></i>

${new Date(notice.created_at).toLocaleDateString("en-GB")}

</p>

<p>

${notice.description.length > 180
? notice.description.substring(0,180) + "..."
: notice.description}

</p>

</div>

<div class="card-footer bg-white border-0">

${notice.pdf_url ? `
<a href="${notice.pdf_url}"
target="_blank"
class="btn btn-success btn-sm">

<i class="fa-solid fa-download"></i>

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

loadNotices();


// ======================================
// SEARCH
// ======================================

const search = document.getElementById("searchNotice");

if (search) {

    search.addEventListener("keyup", async function () {

        const keyword = this.value.toLowerCase();

        const { data } = await window.supabaseClient
            .from("notices")
            .select("*")
            .order("created_at", { ascending: false });

        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        );

        const noticeContainer =
            document.getElementById("noticeContainer");

        noticeContainer.innerHTML = "";

        filtered.forEach(notice => {

            noticeContainer.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card shadow h-100">

<div class="card-body">

<h5>${notice.title}</h5>

<p>${notice.description.substring(0,150)}...</p>

<a href="notice-view.html?id=${notice.id}"
class="btn btn-primary btn-sm">

Read More

</a>

</div>

</div>

</div>

`;

        });

    });

}
