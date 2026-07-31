/* ===========================================
   MADRASA-E NURUL QURAN
   RECEIPT.JS
=========================================== */

const db = window.supabaseClient;

/* ===========================================
   GET RECEIPT NO
=========================================== */

const params = new URLSearchParams(window.location.search);

const receiptNo = params.get("receipt");

/* ===========================================
   LOAD RECEIPT
=========================================== */

async function loadReceipt() {

    if (!receiptNo) {

        alert("Receipt Number Missing");
        return;

    }

    const { data, error } = await db

        .from("fees")

        .select(`
            *,
            students(
                id,
                name,
                class
            )
        `)

        .eq("receipt_no", receiptNo)

        .single();

    if (error) {

        console.error(error);

        alert("Receipt Not Found");

        return;

    }

    document.getElementById("receiptNo").textContent =
        data.receipt_no;

    document.getElementById("paymentDate").textContent =
        data.payment_date;

    document.getElementById("paymentMethod").textContent =
        data.payment_method;

    document.getElementById("studentId").textContent =
        data.students.id;

    document.getElementById("studentName").textContent =
        data.students.name;

    document.getElementById("studentClass").textContent =
        data.students.class;

    document.getElementById("feeMonth").textContent =
        data.month;

    document.getElementById("feeType").textContent =
        data.fee_type;

    document.getElementById("amount").textContent =
        "৳ " + Number(data.amount).toLocaleString();

    document.getElementById("discount").textContent =
        "৳ " + Number(data.discount).toLocaleString();

    document.getElementById("paid").textContent =
        "৳ " + Number(data.paid).toLocaleString();

    document.getElementById("due").textContent =
        "৳ " + Number(data.due).toLocaleString();

}

/* ===========================================
   AUTO LOAD
=========================================== */

document.addEventListener("DOMContentLoaded", loadReceipt);
