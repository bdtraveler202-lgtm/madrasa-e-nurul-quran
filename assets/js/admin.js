// ======================================
// ADMIN DASHBOARD
// ======================================

(async function(){

const { data } =
await window.supabaseClient.auth.getSession();

if(!data.session){

window.location.href="login.html";

return;

}

loadDashboard();

})();

// ======================================
// LOGOUT
// ======================================

document
.getElementById("logoutBtn")
.addEventListener("click",logout);

// ======================================
// DASHBOARD
// ======================================

async function loadDashboard(){

// STUDENTS

const { count:students } =
await window.supabaseClient
.from("students")
.select("*",{
count:"exact",
head:true
});

document.getElementById("totalStudents").innerText=
students || 0;


// TEACHERS

const { count:teachers } =
await window.supabaseClient
.from("teachers")
.select("*",{
count:"exact",
head:true
});

document.getElementById("totalTeachers").innerText=
teachers || 0;


// DONATION

const { data:donation } =
await window.supabaseClient
.from("donations")
.select("amount");

let donationTotal=0;

if(donation){

donation.forEach(item=>{

donationTotal+=Number(item.amount||0);

});

}

document.getElementById("totalDonation").innerHTML=
"৳"+donationTotal;


// TODAY INCOME

const today=
new Date().toISOString().split("T")[0];

const { data:income } =
await window.supabaseClient
.from("income")
.select("amount,date")
.eq("date",today);

let todayIncome=0;

if(income){

income.forEach(item=>{

todayIncome+=Number(item.amount||0);

});

}

document.getElementById("todayIncome").innerHTML=
"৳"+todayIncome;


// TODAY EXPENSE

const { data:expense } =
await window.supabaseClient
.from("expenses")
.select("amount,date")
.eq("date",today);

let todayExpense=0;

if(expense){

expense.forEach(item=>{

todayExpense+=Number(item.amount||0);

});

}

document.getElementById("todayExpense").innerHTML=
"৳"+todayExpense;


// TODAY ATTENDANCE

const { count:attendance } =
await window.supabaseClient
.from("attendance")
.select("*",{
count:"exact",
head:true
})
.eq("date",today);

document.getElementById("todayAttendance").innerText=
attendance || 0;


// DONATION CHART

loadDonationChart();

}

// ======================================
// DONATION CHART
// ======================================

async function loadDonationChart(){

const { data } =
await window.supabaseClient
.from("donations")
.select("amount,date")
.order("date",{ascending:true});

const labels=[];
const amounts=[];

data.forEach(item=>{

labels.push(item.date);

amounts.push(item.amount);

});

new Chart(

document.getElementById("donationChart"),

{

type:"line",

data:{

labels,

datasets:[{

label:"Donation",

data:amounts,

fill:false,

borderColor:"#198754",

backgroundColor:"#198754",

tension:.4

}]

},

options:{

responsive:true,

maintainAspectRatio:false

}

}

);

}
