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

            <div class="card shadow h-100">

                ${
                    notice.image_url
                    ? `<img src="${notice.image_url}" class="card-img-top" style="height:220px;object-fit:cover;">`
                    : ""
                }

                <div class="card-body">

                    <h5 class="card-title">

                        ${notice.pinned ? "📌" : ""}

                        ${notice.title}

                    </h5>

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

                </div>

            </div>

        </div>

        `;

    });

}

loadHomeNotices();
