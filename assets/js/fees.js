/* ===========================================
   MADRASA-E NURUL QURAN
   FEES.JS
=========================================== */

const db = window.supabaseClient;

let currentStudent = null;

/* ===========================================
   ELEMENTS
=========================================== */

const searchInput = document.getElementById("studentSearch");
const searchBtn = document.getElementById("searchStudent");

const studentPhoto = document.getElementById("studentPhoto");
const studentName = document.getElementById("studentName");
const studentId = document.getElementById("studentId");
const fatherName = document.getElementById("fatherName");
const studentClass = document.getElementById("studentClass");
const studentMobile = document.getElementById("studentMobile");

const amount = document.getElementById("amount");
const discount = document.getElementById("discount");
const paid = document.getElementById("paid");
const due = document.getElementById("due");

const feeForm = document.getElementById("feeForm");
const historyTable = document.getElementById("paymentHistory");

/* ===========================================
   SESSION
=========================================== */

async function checkSession() {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (!session) {

        location.href = "login.html";
        return false;

    }

    return true;

}

/* ===========================================
   SEARCH STUDENT
=========================================== */

async function searchStudent() {

    const keyword = searchInput.value.trim();

    if (!keyword) {

        alert("Student ID / Name লিখুন");
        return;

    }

    const { data, error } = await db
        .from("students")
        .select("*")
        .or(
            `id.eq.${keyword},name.ilike.%${keyword}%,mobile.ilike.%${keyword}%`
        )
        .limit(1);

    if (error) {

        console.error(error);
        return;

    }

    if (!data.length) {

        alert("Student পাওয়া যায়নি");
        return;

    }

    currentStudent = data[0];

    studentPhoto.src =
        currentStudent.photo ||
        "assets/img/avatar.png";

    studentName.textContent =
        currentStudent.name;

    studentId.textContent =
        currentStudent.id;

    fatherName.textContent =
        currentStudent.father_name || "-";

    studentClass.textContent =
        currentStudent.class;

    studentMobile.textContent =
        currentStudent.mobile || "-";

    loadPaymentHistory();

}

searchBtn.addEventListener(
    "click",
    searchStudent
);
/* ===========================================
   DUE CALCULATION
=========================================== */

function calculateDue() {

    const totalAmount = Number(amount.value) || 0;
    const totalDiscount = Number(discount.value) || 0;
    const totalPaid = Number(paid.value) || 0;

    const totalDue = totalAmount - totalDiscount - totalPaid;

    due.value = totalDue > 0 ? totalDue : 0;

}

amount.addEventListener("input", calculateDue);
discount.addEventListener("input", calculateDue);
paid.addEventListener("input", calculateDue);

/* ===========================================
   GENERATE RECEIPT
=========================================== */

async function generateReceiptNo() {

    const { data, error } = await db.rpc("generate_receipt_no");

    if (error) {

        console.error(error);

        return "RCP-" + Date.now();

    }

    return data;

}

/* ===========================================
   SAVE PAYMENT
=========================================== */

feeForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!currentStudent) {

        alert("প্রথমে Student Search করুন।");
        return;

    }

    const receiptNo = await generateReceiptNo();

    const feeData = {

        student_id: currentStudent.id,

        receipt_no: receiptNo,

        payment_date: new Date().toISOString().split("T")[0],

        month: document.getElementById("feeMonth").value,

        fee_type: document.getElementById("feeType").value,

        amount: Number(amount.value) || 0,

        discount: Number(discount.value) || 0,

        paid: Number(paid.value) || 0,

        due: Number(due.value) || 0,

        payment_method: document.getElementById("paymentMethod").value,

        remarks: document.getElementById("remarks").value

    };

    const { error } = await db
        .from("fees")
        .insert(feeData);

    if (error) {

        console.error(error);

        alert(error.message);

        return;

    }

    alert("Payment Saved Successfully");

    feeForm.reset();

    discount.value = 0;
    due.value = "";

    loadPaymentHistory();

}); 
/* ===========================================
   PAYMENT HISTORY
=========================================== */

async function loadPaymentHistory() {

    if (!currentStudent) {

        historyTable.innerHTML = `
        <tr>
            <td colspan="10" class="text-center">
                Search a student first
            </td>
        </tr>`;
        return;

    }

    const { data, error } = await db
        .from("fees")
        .select("*")
        .eq("student_id", currentStudent.id)
        .order("payment_date", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    historyTable.innerHTML = "";

    if (!data || data.length === 0) {

        historyTable.innerHTML = `
        <tr>
            <td colspan="10" class="text-center">
                No Payment History Found
            </td>
        </tr>`;
        return;

    }

    data.forEach(item => {

        historyTable.innerHTML += `

<tr>

<td>${item.receipt_no}</td>

<td>${item.payment_date}</td>

<td>${item.month}</td>

<td>${item.fee_type}</td>

<td>৳${item.amount}</td>

<td>৳${item.discount}</td>

<td>৳${item.paid}</td>

<td>৳${item.due}</td>

<td>${item.payment_method}</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="printReceipt('${item.receipt_no}')">

<i class="fa-solid fa-print"></i>

</button>

</td>

</tr>

`;

    });

}

/* ===========================================
   PRINT RECEIPT
=========================================== */

function printReceipt(receiptNo) {

    window.open(
        "receipt.html?receipt=" +
        encodeURIComponent(receiptNo),
        "_blank"
    );

}

/* ===========================================
   REFRESH HISTORY
=========================================== */

const refreshBtn = document.getElementById("refreshHistory");

if (refreshBtn) {

    refreshBtn.addEventListener("click", () => {

        loadPaymentHistory();

    });

}

/* ===========================================
   LOGOUT
=========================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        if (!confirm("Logout করবেন?")) return;

        await db.auth.signOut();

        location.href = "login.html";

    });

}

/* ===========================================
   INIT
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const ok = await checkSession();

    if (!ok) return;

});
