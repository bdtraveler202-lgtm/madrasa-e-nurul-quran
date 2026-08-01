/* ==========================================
   MADRASA-E NURUL QURAN
   RECEIPT.JS
========================================== */

const db = window.supabaseClient;

/* ==========================
   SESSION
========================== */

async function checkSession(){

const {data:{session}}=await db.auth.getSession();

if(!session){

location.href="login.html";

return false;

}

return true;

}

/* ==========================
   LOAD RECEIPT
========================== */

async function loadReceipt(){

const receiptNo=new URLSearchParams(location.search).get("receipt");

if(!receiptNo){

alert("Receipt Not Found");

return;

}

const {data:fee,error}=await db

.from("fees")

.select("*")

.eq("receipt_no",receiptNo)

.single();

if(error||!fee){

alert("Receipt Not Found");

return;

}

const {data:student}=await db

.from("students")

.select("*")

.eq("student_id",fee.student_id)

.single();

document.getElementById("receiptNo").textContent=
fee.receipt_no;

document.getElementById("paymentDate").textContent=
fee.payment_date;

document.getElementById("studentID").textContent=
student?.student_id || "-";

document.getElementById("studentName").textContent=
student?.student_name_bn ||
student?.student_name_en ||
"-";

document.getElementById("department").textContent=
student?.department || "-";

document.getElementById("studentClass").textContent=
student?.class_name || "-";

document.getElementById("feeType").textContent=
fee.fee_type;

document.getElementById("feeMonth").textContent=
fee.month;

document.getElementById("paymentMethod").textContent=
fee.payment_method;

document.getElementById("amount").textContent=
"৳"+Number(fee.amount).toLocaleString();

document.getElementById("discount").textContent=
"৳"+Number(fee.discount).toLocaleString();

document.getElementById("paid").textContent=
"৳"+Number(fee.paid).toLocaleString();

document.getElementById("due").textContent=
"৳"+Number(fee.due).toLocaleString();

const qrText=
location.origin+
"/receipt.html?receipt="+
encodeURIComponent(fee.receipt_no);

document.getElementById("qrCode").src=
"https://api.qrserver.com/v1/create-qr-code/?size=220x220&data="+
encodeURIComponent(qrText);

}

/* ==========================
   PRINT
========================== */

function printReceipt(){

window.print();

}

/* ==========================
   INIT
========================== */

document.addEventListener("DOMContentLoaded",async()=>{

const ok=await checkSession();

if(!ok) return;

await loadReceipt();

});
