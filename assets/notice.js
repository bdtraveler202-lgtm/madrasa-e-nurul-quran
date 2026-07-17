// ======================================
// Check Login Session
// ======================================

window.supabaseClient.auth.getSession().then(({ data }) => {

    if (!data.session) {

        alert("❌ আপনি Login করেননি!");

        window.location.href = "login.html";

    } else {

        loadNotices();

    }

});

// ======================================
// Load Notices
// ======================================

async function loadNotices() {

    const { data, error } = await window.supabaseClient
        .from("notices")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        alert("নোটিশ লোড করা যায়নি!");
        return;
    }

    const table = document.getElementById("noticeTable");

    table.innerHTML = "";

    if (data.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="3" class="text-center">
                কোনো নোটিশ পাওয়া যায়নি
            </td>
        </tr>
        `;

        return;
    }

    data.forEach(notice => {

        table.innerHTML += `
        <tr>
            <td>${notice.id}</td>
            <td>${notice.title}</td>
            <td>${notice.description}</td>
        </tr>
        `;

    });

}

// ======================================
// Add Notice
// ======================================

const noticeForm = document.getElementById("noticeForm");

if (noticeForm) {

    noticeForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const title = document.getElementById("title").value.trim();

        const description = document.getElementById("description").value.trim();

        if (title === "" || description === "") {

            alert("সব তথ্য পূরণ করুন!");

            return;

        }

        const { error } = await window.supabaseClient
            .from("notices")
            .insert([
                {
                    title: title,
                    description: description
                }
            ]);

        if (error) {

            console.error(error);

            alert("❌ " + error.message);

            return;

        }

        alert("✅ Notice সফলভাবে যোগ হয়েছে");

        noticeForm.reset();

        loadNotices();

    });

}
