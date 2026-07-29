// ======================================
// DONATION MANAGEMENT V1
// assets/js/donation.js
// ======================================

let donations=[];

document.addEventListener("click",function(e){

if(e.target.closest("#donationMenu")){

e.preventDefault();

donationPage();

}

});

function donationPage(){

document.getElementById("pageTitle").innerText="Donation Management";

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Donation Management</h4>

<button class="btn-green" id="addDonationBtn">

Add Donation

</button>

</div>

<div class="table-responsive">

<table class="table">

<thead>

<tr>

<th>Date</th>

<th>Donor</th>

<th>Mobile</th>

<th>Amount</th>

<th>Purpose</th>

<th>Action</th>

</tr>

</thead>

<tbody id="donationTable">

<tr>

<td colspan="6">

Loading...

</td>

</tr>

</tbody>

</table>

</div>

<hr>

<h4 class="mt-4 mb-3">

Donation Analytics

</h4>

<canvas id="donationChart" height="100"></canvas>

</div>

</div>

`;

loadDonations();

}

async function loadDonations(){

const table=document.getElementById("donationTable");

const {data,error}=await window.supabaseClient

.from("donations")

.select("*")

.order("date",{ascending:true});

if(error){

table.innerHTML=`<tr><td colspan="6">${error.message}</td></tr>`;

return;

}

donations=data||[];

renderDonations();

drawDonationChart();

}

function renderDonations(){

const table=document.getElementById("donationTable");

table.innerHTML="";

if(donations.length===0){

table.innerHTML="<tr><td colspan='6'>No Donation Found</td></tr>";

return;

}

donations.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.donor_name}</td>

<td>${item.mobile}</td>

<td>৳ ${item.amount}</td>

<td>${item.purpose}</td>

<td>

<button

class="btn btn-danger btn-sm"

onclick="deleteDonation(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

}

document.addEventListener("click",function(e){

if(!e.target.closest("#addDonationBtn")) return;

document.getElementById("contentArea").innerHTML=`

<div class="card">

<div class="card-body">

<form id="donationForm">

<div class="row">

<div class="col-md-6 mb-3">

<label>Donor Name</label>

<input type="text" id="donor_name" class="form-control" required>

</div>

<div class="col-md-6 mb-3">

<label>Mobile</label>

<input type="text" id="mobile" class="form-control">

</div>

<div class="col-md-6 mb-3">

<label>Amount</label>

<input type="number" id="amount" class="form-control" required>

</div>

<div class="col-md-6 mb-3">

<label>Date</label>

<input type="date" id="date" class="form-control" required>

</div>

<div class="col-12 mb-3">

<label>Purpose</label>

<textarea id="purpose" class="form-control"></textarea>

</div>

<div class="col-12">

<button class="btn-green">

Save Donation

</button>

</div>

</div>

</form>

</div>

</div>

`;

});

document.addEventListener("submit",async function(e){

if(e.target.id!=="donationForm") return;

e.preventDefault();

const {error}=await window.supabaseClient

.from("donations")

.insert([{

donor_name:donor_name.value,

mobile:mobile.value,

amount:Number(amount.value),

date:date.value,

purpose:purpose.value

}]);

if(error){

alert(error.message);

return;

}

alert("Donation Saved");

donationPage();

});

window.deleteDonation=async function(id){

if(!confirm("Delete Donation?")) return;

await window.supabaseClient

.from("donations")

.delete()

.eq("id",id);

loadDonations();

};

function drawDonationChart(){

const ctx=document.getElementById("donationChart");

if(!ctx) return;

new Chart(ctx,{

type:"bar",

data:{

labels:donations.map(x=>x.date),

datasets:[{

label:"Donation",

data:donations.map(x=>x.amount),

backgroundColor:"#198754"

}]

},

options:{

responsive:true,

plugins:{

legend:{display:false}

}

}

});

}
