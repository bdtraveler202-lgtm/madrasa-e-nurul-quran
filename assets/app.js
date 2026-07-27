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
