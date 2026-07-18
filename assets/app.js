// =============================
// Admission Form
// =============================

const admissionForm = document.getElementById("admissionForm");

if (admissionForm) {

  admissionForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const student = {
      full_name: document.getElementById("full_name").value,
      father_name: document.getElementById("father_name").value,
      mother_name: document.getElementById("mother_name").value,
      mobile: document.getElementById("mobile").value,
      class: document.getElementById("class").value,
      address: document.getElementById("address").value
    };

    const { error } = await window.supabaseClient
      .from("students")
      .insert([student]);

    if (error) {
      console.error(error);
      alert("❌ ভর্তি সংরক্ষণ করা যায়নি!");
    } else {
      alert("✅ ভর্তি আবেদন সফলভাবে জমা হয়েছে!");
      admissionForm.reset();
    }

  });

}
// ==========================
// Back To Top
// ==========================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};
