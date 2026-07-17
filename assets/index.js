// ======================================
// Home Page Notice Loader
// ======================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        document.getElementById("noticeList").innerHTML =
            "<li>❌ নোটিশ লোড করা যায়নি</li>";

        return;

    }

    const noticeList = document.getElementById("noticeList");

    noticeList.innerHTML = "";

    if (data.length === 0) {

        noticeList.innerHTML =
            "<li>কোনো নোটিশ পাওয়া যায়নি।</li>";

        return;

    }

    data.forEach(notice => {

        noticeList.innerHTML += `
            <li>
                📌 <strong>${notice.title}</strong><br>
                ${notice.description}
            </li>
        `;

    });

}

loadNotices();
