// ======================================
// ADMIN DASHBOARD V1
// ======================================

async function checkLogin(){

const { data, error } =
await window.supabaseClient.auth.getSession();

if(error){

alert(error.message);

return;

}

if(!data.session){

window.location.href="login.html";

return;

}

loadDashboard();

}

checkLogin();

// ======================================
// DASHBOARD
// ======================================

async function loadDashboard(){

// Total Students

const { count:students } =
await window.supabaseClient
.from("students")
.select("*",{
count:"exact",
head:true
});

document.getElementById("totalStudents").innerText=
students || 0;


// Total Teachers

const { count:teachers } =
await window.supabaseClient
.from("teachers")
.select("*",{
count:"exact",
head:true
});

document.getElementById("totalTeachers").innerText=
teachers || 0;


// Total Donation

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

document.getElementById("totalDonation").innerText=
donationTotal;


// Today Income

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

document.getElementById("todayIncome").innerText=
todayIncome;

}

// ======================================
// LOGOUT
// ======================================

const logoutBtn=
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",async()=>{

await window.supabaseClient.auth.signOut();

window.location.href="login.html";

});

}
