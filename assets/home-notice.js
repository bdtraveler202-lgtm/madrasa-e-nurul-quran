// ======================================
// Homepage Notice Board
// ======================================

async function loadHomeNotices() {

    const { data, error } = await window.supabaseClient

        .from("notices")

        .select("*")

        .order("pinned", { ascending: false })

        .order("created_at", { ascending: false })

        .limit(6);

    if (error) {

        console.error(error);

        return;

    }

    const board = document.getElementById("noticeBoard");

    board.innerHTML = "";

    if (!data.length) {

        board.innerHTML = `

        <div class="col-12">

            <div class="alert alert-warning">

                কোনো Notice পাওয়া যায়নি।

            </div>

        </div>

        `;

        return;

    }

    data.forEach(notice => {

        board.innerHTML += `

        <div class="col-lg-4 col-md-6">

           <div class="card notice-card shadow h-100">
                ${
                    notice.image_url
                    ? `<img src="${notice.image_url}" class="card-img-top" style="height:220px;object-fit:cover;">`
                    : ""
                }

                <div class="card-body">

${
notice.pinned
? `<span class="badge bg-warning text-dark mb-2">
📌 Pinned
</span>`
: ""
}

<h5 class="card-title">

${notice.title}

</h5>
                   
<p class="text-muted small mb-2">
    <i class="fa-solid fa-calendar-days"></i>
    ${new Date(notice.created_at).toLocaleDateString("en-GB")}
</p>

                    ${
                        notice.important
                        ? `<span class="badge bg-danger mb-2">Important</span>`
                        : ""
                    }

                    <p class="card-text">

                        ${notice.description.substring(0,120)}...

                    </p>

                </div>

               <div class="card-footer bg-white">

    ${
        notice.pdf_url
        ? `<a href="${notice.pdf_url}" target="_blank" class="btn btn-success btn-sm">
            Download PDF
        </a>`
        : ""
    }

    <a
        href="notice-view.html?id=${notice.id}"
        class="btn btn-outline-primary btn-sm ms-2">

        Read More

    </a>

</div>

            </div>

        </div>

        `;

    });

}

loadHomeNotices();
