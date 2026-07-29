// ======================================
// ACCOUNTS MANAGEMENT V1
// assets/js/accounts.js
// ======================================

let incomeData=[];
let expenseData=[];

document.addEventListener("click",function(e){

if(e.target.closest("#accountsMenu")){

e.preventDefault();

accountsPage();

}

});

function accountsPage(){

document.getElementById("pageTitle").innerText="Income & Expense";

document.getElementById("contentArea").innerHTML=`

<div class="row">

<div class="col-lg-6">

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Income</h4>

<button class="btn-green" id="addIncomeBtn">

Add Income

</button>

</div>

<table class="table">

<thead>

<tr>

<th>Date</th>

<th>Source</th>

<th>Amount</th>

<th>Action</th>

</tr>

</thead>

<tbody id="incomeTable">

<tr>

<td colspan="4">

Loading...

</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

<div class="col-lg-6">

<div class="card">

<div class="card-body">

<div class="d-flex justify-content-between mb-3">

<h4>Expense</h4>

<button class="btn-green" id="addExpenseBtn">

Add Expense

</button>

</div>

<table class="table">

<thead>

<tr>

<th>Date</th>

<th>Purpose</th>

<th>Amount</th>

<th>Action</th>

</tr>

</thead>

<tbody id="expenseTable">

<tr>

<td colspan="4">

Loading...

</td>

</tr>

</tbody>

</table>

</div>

</div>

</div>

</div>

`;

loadIncome();

loadExpense();

}

// ======================================
// LOAD INCOME
// ======================================

async function loadIncome(){

const table=document.getElementById("incomeTable");

const {data,error}=await window.supabaseClient

.from("income")

.select("*")

.order("date",{ascending:false});

if(error){

table.innerHTML=`<tr><td colspan="4">${error.message}</td></tr>`;

return;

}

incomeData=data||[];

table.innerHTML="";

incomeData.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.source}</td>

<td>৳ ${item.amount}</td>

<td>

<button

class="btn btn-danger btn-sm"

onclick="deleteIncome(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

}

// ======================================
// LOAD EXPENSE
// ======================================

async function loadExpense(){

const table=document.getElementById("expenseTable");

const {data,error}=await window.supabaseClient

.from("expenses")

.select("*")

.order("date",{ascending:false});

if(error){

table.innerHTML=`<tr><td colspan="4">${error.message}</td></tr>`;

return;

}

expenseData=data||[];

table.innerHTML="";

expenseData.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.date}</td>

<td>${item.purpose}</td>

<td>৳ ${item.amount}</td>

<td>

<button

class="btn btn-danger btn-sm"

onclick="deleteExpense(${item.id})">

Delete

</button>

</td>

</tr>

`;

});

}

// ======================================
// DELETE
// ======================================

window.deleteIncome=async function(id){

if(!confirm("Delete Income?")) return;

await window.supabaseClient

.from("income")

.delete()

.eq("id",id);

loadIncome();

};

window.deleteExpense=async function(id){

if(!confirm("Delete Expense?")) return;

await window.supabaseClient

.from("expenses")

.delete()

.eq("id",id);

loadExpense();

};
