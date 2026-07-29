/* ===========================================
   MADRASA ERP
   HOME.JS
   VERSION 1.0
=========================================== */

/* ==========================
   LOADER
========================== */

window.addEventListener("load", () => {

const loader = document.getElementById("loader");

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},500);

}

});

/* ==========================
   LIVE CLOCK
========================== */

function updateClock(){

const clock=document.getElementById("liveClock");

if(!clock) return;

const now=new Date();

clock.innerHTML=now.toLocaleTimeString("en-GB",{

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

});

}

setInterval(updateClock,1000);

updateClock();

/* ==========================
   ENGLISH DATE
========================== */

function englishDate(){

const el=document.getElementById("todayEnglish");

if(!el) return;

const today=new Date();

el.innerHTML=today.toLocaleDateString("en-GB",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

}

englishDate();

/* ==========================
   BANGLA DATE
========================== */

function banglaDate(){

const el=document.getElementById("todayBangla");

if(!el) return;

const today=new Date();

el.innerHTML=today.toLocaleDateString("bn-BD",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

}

banglaDate();

/* ==========================
   HIJRI DATE
========================== */

function hijriDate(){

const el=document.getElementById("todayHijri");

if(!el) return;

const today=new Date();

el.innerHTML=new Intl.DateTimeFormat("en-TN-u-ca-islamic",{

day:"numeric",

month:"long",

year:"numeric"

}).format(today);

}

hijriDate();
/* ===========================================
   LANGUAGE SWITCH
=========================================== */

const translations = {

bn:{

home:"হোম",
about:"প্রতিষ্ঠান",
teachers:"শিক্ষকবৃন্দ",
students:"শিক্ষার্থীবৃন্দ",
notice:"নোটিশ",
gallery:"গ্যালারী",
contact:"যোগাযোগ",
login:"লগইন",
admission:"অনলাইন ভর্তি",
details:"বিস্তারিত"

},

en:{

home:"Home",
about:"About",
teachers:"Teachers",
students:"Students",
notice:"Notice",
gallery:"Gallery",
contact:"Contact",
login:"Login",
admission:"Online Admission",
details:"Learn More"

}

};

let currentLanguage="bn";

function changeLanguage(lang){

currentLanguage=lang;

document.documentElement.lang=lang;

document.documentElement.setAttribute("data-language",lang);

document.getElementById("btnBangla").classList.remove("active");
document.getElementById("btnEnglish").classList.remove("active");

if(lang==="bn"){

document.getElementById("btnBangla").classList.add("active");
document.body.style.fontFamily='"Hind Siliguri","Poppins",sans-serif';

}else{

document.getElementById("btnEnglish").classList.add("active");
document.body.style.fontFamily='"Poppins","Hind Siliguri",sans-serif';

}

const nav=document.querySelectorAll(".navbar-nav .nav-link");

if(nav.length>=7){

nav[0].textContent=translations[lang].home;
nav[1].textContent=translations[lang].about;
nav[2].textContent=translations[lang].teachers;
nav[3].textContent=translations[lang].students;
nav[4].textContent=translations[lang].notice;
nav[5].textContent=translations[lang].gallery;
nav[6].textContent=translations[lang].contact;

}

const loginBtn=document.querySelector(".btn.btn-success.px-4");

if(loginBtn){

loginBtn.textContent=translations[lang].login;

}

const heroButtons=document.querySelectorAll(".hero-buttons a");

if(heroButtons.length===2){

heroButtons[0].textContent=translations[lang].admission;
heroButtons[1].textContent=translations[lang].details;

}

localStorage.setItem("language",lang);

}

document.getElementById("btnBangla").addEventListener("click",()=>{

changeLanguage("bn");

});

document.getElementById("btnEnglish").addEventListener("click",()=>{

changeLanguage("en");

});

const savedLanguage=localStorage.getItem("language");

if(savedLanguage){

changeLanguage(savedLanguage);

}

/* ===========================================
SCROLL TOP
=========================================== */

const scrollBtn=document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>300){

scrollBtn.style.display="flex";

}else{

scrollBtn.style.display="none";

}

});

scrollBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

/* ===========================================
FADE ANIMATION
=========================================== */

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll("section").forEach(section=>{

section.classList.add("fade-up");

observer.observe(section);

});

/* ===========================================
ACTIVE MENU
=========================================== */

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll(".navbar-nav .nav-link");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const top=section.offsetTop-120;

const height=section.clientHeight;

if(pageYOffset>=top){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

const href=link.getAttribute("href");

if(href==="#"+current){

link.classList.add("active");

}

});

}); 
/* ===========================================
   LOAD WEBSITE DATA
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await Promise.all([
        loadLatestNotices(),
        loadNoticeTicker(),
        loadStatistics()
    ]);

});

/* ===========================================
   NOTICE TICKER
=========================================== */

async function loadNoticeTicker() {

    const ticker = document.getElementById("noticeTicker");

    if (!ticker) return;

    const { data, error } = await supabase
        .from("notices")
        .select("title")
        .eq("status", "Published")
        .order("notice_date", { ascending: false })
        .limit(10);

    if (error) {

        ticker.innerHTML = "No Notice Available";

        return;

    }

    if (!data || data.length === 0) {

        ticker.innerHTML = "No Notice Available";

        return;

    }

    ticker.innerHTML = data
        .map(item => item.title)
        .join(" &nbsp;&nbsp;&nbsp; ● &nbsp;&nbsp;&nbsp; ");

}

/* ===========================================
   LATEST NOTICE
=========================================== */

async function loadLatestNotices() {

    const list = document.getElementById("latestNoticeList");

    if (!list) return;

    const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("status", "Published")
        .order("notice_date", { ascending: false })
        .limit(5);

    if (error) {

        list.innerHTML = "<p>Notice loading failed.</p>";

        return;

    }

    list.innerHTML = "";

    data.forEach(item => {

        list.innerHTML += `

<div class="notice-card">

<h4>${item.title}</h4>

<p>${item.details ?? ""}</p>

<div class="notice-date">

${item.notice_date ?? ""}

</div>

</div>

`;

    });

}

/* ===========================================
   STATISTICS
=========================================== */

async function loadStatistics() {

    const student = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

    const teacher = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true });

    const employee = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalStudents").textContent =
        student.count ?? 0;

    document.getElementById("totalTeachers").textContent =
        teacher.count ?? 0;

    document.getElementById("totalStaff").textContent =
        employee.count ?? 0;

}
/* ===========================================
   HOME DATA LOADER
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadTeachers();

    await loadStudents();

    await loadGallery();

    await loadVideos();

});

/* ===========================================
   TEACHERS
=========================================== */

async function loadTeachers(){

const container=document.getElementById("teacherHomeList");

if(!container) return;

const {data,error}=await supabase

.from("teachers")

.select("*")

.eq("status","Active")

.order("created_at",{ascending:false})

.limit(4);

if(error){

console.error(error);

return;

}

container.innerHTML="";

data.forEach(item=>{

container.innerHTML+=`

<div class="col-lg-3 col-md-6 mb-4">

<div class="teacher-card">

<img src="${item.photo_url || 'assets/img/default-user.png'}">

<div class="teacher-content">

<h4>${item.full_name}</h4>

<p>${item.designation ?? ''}</p>

</div>

</div>

</div>

`;

});

}

/* ===========================================
   STUDENTS
=========================================== */

async function loadStudents(){

const container=document.getElementById("studentHomeList");

if(!container) return;

const {data,error}=await supabase

.from("students")

.select("*")

.eq("status","Active")

.order("created_at",{ascending:false})

.limit(8);

if(error){

console.error(error);

return;

}

container.innerHTML="";

data.forEach(item=>{

container.innerHTML+=`

<div class="col-lg-3 col-md-6 mb-4">

<div class="student-card">

<img src="${item.photo_url || 'assets/img/default-user.png'}">

<div class="student-content">

<h4>${item.full_name}</h4>

<p>${item.student_id}</p>

<p>${item.class_name}</p>

</div>

</div>

</div>

`;

});

}

/* ===========================================
   PHOTO GALLERY
=========================================== */

async function loadGallery(){

const container=document.getElementById("galleryHome");

if(!container) return;

const {data,error}=await supabase

.from("gallery")

.select("*")

.order("created_at",{ascending:false})

.limit(8);

if(error){

console.error(error);

return;

}

container.innerHTML="";

data.forEach(item=>{

container.innerHTML+=`

<div class="col-lg-3 col-md-6 mb-4">

<div class="gallery-item">

<img

src="${item.image_url}"

alt="${item.title}">

</div>

</div>

`;

});

}

/* ===========================================
   VIDEO GALLERY
=========================================== */

async function loadVideos(){

const container=document.getElementById("videoHome");

if(!container) return;

const {data,error}=await supabase

.from("videos")

.select("*")

.order("created_at",{ascending:false})

.limit(3);

if(error){

console.error(error);

return;

}

container.innerHTML="";

data.forEach(item=>{

container.innerHTML+=`

<div class="col-lg-4 mb-4">

<div class="video-card">

<iframe

src="${item.video_url}"

allowfullscreen>

</iframe>

<div class="video-content">

<h4>${item.title}</h4>

</div>

</div>

</div>

`;

});

}
/* ===========================================
   DONATION PROGRESS
=========================================== */

async function loadDonationProgress() {

    const { data, error } = await supabase
        .from("donations")
        .select("amount,target_amount");

    if (error || !data) return;

    let collected = 0;
    let target = 0;

    data.forEach(item => {
        collected += Number(item.amount || 0);
        target = Number(item.target_amount || target);
    });

    const percent = target > 0
        ? Math.min((collected / target) * 100, 100)
        : 0;

    document.getElementById("targetAmount").textContent =
        "৳ " + target.toLocaleString();

    document.getElementById("collectedAmount").textContent =
        "৳ " + collected.toLocaleString();

    document.getElementById("remainingAmount").textContent =
        "৳ " + (target - collected).toLocaleString();

    const bar = document.getElementById("donationProgressBar");

    if (bar) {

        bar.style.width = percent + "%";
        bar.textContent = percent.toFixed(0) + "%";

    }

}

/* ===========================================
   WEBSITE SETTINGS
=========================================== */

async function loadWebsiteSettings() {

    const { data } = await supabase

        .from("settings")

        .select("*")

        .limit(1)

        .single();

    if (!data) return;

    document.title = data.website_name || document.title;

    document.getElementById("addressText").textContent =
        data.address || "";

    document.getElementById("phoneText").textContent =
        data.phone || "";

    document.getElementById("emailText").textContent =
        data.email || "";

}

/* ===========================================
   SIMPLE SEARCH
=========================================== */

const searchInput = document.getElementById("globalSearch");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        console.log("Search:", this.value);

    });

}

/* ===========================================
   INITIALIZE
=========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadDonationProgress();

    await loadWebsiteSettings();

});


