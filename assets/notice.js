// ======================================
// Notice Management
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

noticeForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const title = document.getElementById("title").value;

    const description = document.getElementById("description").value;

    const { error } = await window.supabaseClient
        .from("notices")
        .insert([{

            title,
            description

        }]);

    if(error){

        console.error(error);

        alert("❌ Notice যোগ করা যায়নি");

        return;

    }

    alert("✅ Notice সফলভাবে যোগ হয়েছে");

    noticeForm.reset();

    loadNotices();

});

// ======================================

loadNotices();
