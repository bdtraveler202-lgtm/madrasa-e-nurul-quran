// ======================================
// MADRASA WEBSITE APP V1
// ======================================

document.addEventListener("DOMContentLoaded", () => {

loadHeader();

loadTicker();

loadHero();

loadPrincipal();

loadLatestNotice();

loadGallery();

loadContact();

loadFooter();

});

// ======================================
// HEADER
// ======================================

function loadHeader(){

document.getElementById("header").innerHTML=`

<div class="topbar text-center">

📞 +8801XXXXXXXXX |
✉️ info@madrasa.com

</div>

<nav class="navbar navbar-expand-lg">

<div class="container">

<a class="navbar-brand fw-bold" href="#">

🕌 মাদরাসায়ে নূরুল কুরআন

</a>

<button
class="navbar-toggler"
data-bs-toggle="collapse"
data-bs-target="#menu">

<span class="navbar-toggler-icon"></span>

</button>

<div
class="collapse navbar-collapse"
id="menu">

<ul class="navbar-nav ms-auto">

<li class="nav-item">
<a class="nav-link" href="#">হোম</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#principal">প্রিন্সিপাল</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#gallery">গ্যালারি</a>
</li>

<li class="nav-item">
<a class="nav-link" href="#contact">যোগাযোগ</a>
</li>

<li class="nav-item">

<a
href="login.html"
class="btn btn-success ms-3">

Admin Login

</a>

</li>

</ul>

</div>

</div>

</nav>

`;

}

// ======================================
// NOTICE TICKER
// ======================================

function loadTicker(){

document.getElementById("ticker").innerHTML=`

<div class="notice-ticker">

<marquee>

📢 মাদরাসার ভর্তি কার্যক্রম চলমান |
পরবর্তী নোটিশ শীঘ্রই প্রকাশিত হবে |

</marquee>

</div>

`;

}
// ======================================
// HERO SECTION
// ======================================

function loadHero(){

document.getElementById("hero").innerHTML=`

<section class="hero">

<div class="container">

<div class="row align-items-center">

<div class="col-lg-6">

<h1>

মাদরাসায়ে নূরুল কুরআন

</h1>

<p>

বিশুদ্ধ কুরআন শিক্ষা, ইসলামিক আদর্শ ও আধুনিক শিক্ষার সমন্বয়ে একটি নির্ভরযোগ্য শিক্ষা প্রতিষ্ঠান।

</p>

<div class="mt-4">

<a
href="#contact"
class="btn btn-light btn-lg">

যোগাযোগ করুন

</a>

<a
href="login.html"
class="btn btn-success btn-lg ms-2">

Admin Login

</a>

</div>

</div>

<div class="col-lg-6 text-center">

<img
src="images/hero.png"
class="img-fluid"
style="max-height:420px;">

</div>

</div>

</div>

</section>

`;

} 


