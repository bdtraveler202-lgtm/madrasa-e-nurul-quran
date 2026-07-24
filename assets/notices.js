// ======================================
// PUBLIC NOTICE BOARD V2
// ======================================

let allNotices = [];

// ======================================
// LOAD NOTICES
// ======================================

async function loadNotices() {

    const container = document.getElementById("noticeContainer");

    container.innerHTML = `
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

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    ❌ Notice Load Failed
                </div>
            </div>
        `;

        return;

    }

    allNotices = data || [];

    renderNoticeCards(allNotices);

} 
// ======================================
// RENDER NOTICE CARDS
// ======================================

function renderNoticeCards(list) {

    const container = document.getElementById("noticeContainer");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning text-center">
                কোনো নোটিশ পাওয়া যায়নি।
            </div>
        </div>
        `;

        return;

    }

    list.forEach(notice => {

        container.innerHTML += `

<div class="col-lg-4 col-md-6">

<div class="card notice-card shadow-sm h-100">

${notice.image_url ? `
<img src="${notice.image_url}"
class="card-img-top notice-img">
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

<span class="badge bg-success ms-1">
${notice.category || "সাধারণ"}
</span>

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

loadNotices();
// ======================================
// LIVE SEARCH + CATEGORY FILTER
// ======================================

const searchInput = document.getElementById("searchNotice");
const categoryFilter = document.getElementById("categoryFilter");

function filterNotices() {

    const keyword = searchInput.value.toLowerCase().trim();

    const category = categoryFilter.value;

    const filtered = allNotices.filter(notice => {

        const matchKeyword =

            notice.title.toLowerCase().includes(keyword) ||

            notice.description.toLowerCase().includes(keyword);

        const matchCategory =

            category === "" ||

            notice.category === category;

        return matchKeyword && matchCategory;

    });

    renderNoticeCards(filtered);

}

if (searchInput) {

    searchInput.addEventListener("input", filterNotices);

}

if (categoryFilter) {

    categoryFilter.addEventListener("change", filterNotices);

}







