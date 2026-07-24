// ======================================
// Home Page Notice Loader
// ======================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });

    const noticeList = document.getElementById("noticeList");

    if (error) {

        console.error(error);

        noticeList.innerHTML =
            "<li>❌ নোটিশ লোড করা যায়নি</li>";

        return;

    }

    noticeList.innerHTML = "";

    if (!data || data.length === 0) {

        noticeList.innerHTML =
            "<li>কোনো নোটিশ পাওয়া যায়নি।</li>";

        return;

    }

    data.forEach(notice => {

        noticeList.innerHTML += `

        <li class="mb-4">

            <h5>

                ${notice.pinned ? "📌 " : ""}

                ${notice.title}

                ${notice.important
                    ? '<span class="badge bg-danger ms-2">Important</span>'
                    : ''}

            </h5>

            <p>${notice.description}</p>

            ${notice.image_url
                ? `
                <img
                    src="${notice.image_url}"
                    class="img-fluid rounded mb-2"
                    style="max-width:300px;">
                `
                : ""}

            ${notice.pdf_url
                ? `
                <br>

                <a
                    href="${notice.pdf_url}"
                    target="_blank"
                    class="btn btn-primary btn-sm">

                    📄 Download PDF

                </a>
                `
                : ""}

        </li>

        `;

    });

}

loadNotices();
