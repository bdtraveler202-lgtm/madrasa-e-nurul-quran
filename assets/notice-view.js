// ======================================
// NOTICE DETAILS PAGE
// assets/notice-view.js
// ======================================

// URL থেকে Notice ID নেওয়া
const params = new URLSearchParams(window.location.search);
const noticeId = params.get("id");

// ======================================
// LOAD NOTICE
// ======================================

async function loadNotice() {

    const content = document.getElementById("noticeContent");

    if (!noticeId) {

        content.innerHTML = `
            <div class="alert alert-danger text-center">
                ❌ Invalid Notice ID
            </div>
        `;

        return;

    }

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .eq("id", noticeId)
        .single();

    if (error || !data) {

        console.error(error);

        content.innerHTML = `
            <div class="alert alert-danger text-center">
                ❌ Notice পাওয়া যায়নি।
            </div>
        `;

        return;

    }

    content.innerHTML = `

<div class="card notice-card shadow">

<div class="card-body">

${data.image_url ? `
<img src="${data.image_url}"
class="notice-img mb-4">
` : ""}

<div class="mb-3">

${data.pinned ? `
<span class="badge bg-warning text-dark">
📌 Pinned
</span>
` : ""}

${data.important ? `
<span class="badge bg-danger ms-2">
⭐ Important
</span>
` : ""}

<span class="badge bg-success ms-2">
${data.category || "সাধারণ"}
</span>

</div>

<h2 class="fw-bold">

${data.title}

</h2>

<p class="text-muted">

<i class="fa-solid fa-calendar-days"></i>

${new Date(data.created_at).toLocaleDateString("en-GB")}

</p>

<hr>

<p style="white-space:pre-line;line-height:1.9">

${data.description}

</p>

${data.pdf_url ? `

<a href="${data.pdf_url}"
target="_blank"
class="btn btn-success mt-3">

<i class="fa-solid fa-download"></i>

Download PDF

</a>

` : ""}

<button
onclick="window.print()"
class="btn btn-dark mt-3 ms-2">

<i class="fa-solid fa-print"></i>

Print

</button>

<button
onclick="shareNotice()"
class="btn btn-primary mt-3 ms-2">

<i class="fa-solid fa-share"></i>

Share

</button>

</div>

</div>

`;

}

// ======================================
// SHARE
// ======================================

function shareNotice() {

    if (navigator.share) {

        navigator.share({

            title: document.title,

            url: window.location.href

        });

    } else {

        navigator.clipboard.writeText(window.location.href);

        alert("🔗 Link Copied");

    }

}

loadNotice(); 


