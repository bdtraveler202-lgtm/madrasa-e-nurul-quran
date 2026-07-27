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
// ======================================
// PRINCIPAL SECTION
// ======================================

function loadPrincipal(){

document.getElementById("principal").innerHTML=`

<section class="py-5 bg-light">

<div class="container">

<div class="row align-items-center">

<div class="col-lg-4 text-center">

<img
src="images/principal.jpg"
class="principal-img shadow">

</div>

<div class="col-lg-8">

<h2 class="section-title">

প্রিন্সিপালের বক্তব্য

</h2>

<p style="text-align:justify;line-height:32px;">

আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ।

মাদরাসায়ে নূরুল কুরআনে আপনাদের স্বাগতম। আমাদের লক্ষ্য হলো কুরআন ও সুন্নাহর আলোকে আদর্শ, নৈতিক ও যোগ্য প্রজন্ম গড়ে তোলা। আধুনিক শিক্ষা ও দ্বীনি শিক্ষার সমন্বয়ের মাধ্যমে শিক্ষার্থীদের সুন্দর ভবিষ্যৎ নির্মাণে আমরা নিরলসভাবে কাজ করে যাচ্ছি।

</p>

<h5 class="mt-4">

মাওলানা ___________________

</h5>

<p class="text-success fw-bold">

প্রিন্সিপাল

</p>

</div>

</div>

</div>

</section>

`;

}
// ======================================
// LATEST NOTICE
// ======================================

function loadLatestNotice(){

document.getElementById("latestNotice").innerHTML=`

<section class="py-5">

<div class="container">

<div class="text-center mb-5">

<h2 class="section-title">

সর্বশেষ নোটিশ

</h2>

<p class="text-muted">

মাদরাসার সর্বশেষ গুরুত্বপূর্ণ নোটিশসমূহ

</p>

</div>

<div class="row g-4">

<div class="col-lg-4">

<div class="card h-100">

<div class="card-body">

<h5 class="fw-bold">

📢 ভর্তি বিজ্ঞপ্তি ২০২৬

</h5>

<p>

২০২৬ শিক্ষাবর্ষে ভর্তি কার্যক্রম শুরু হয়েছে।

</p>

<a href="#" class="btn btn-primary">

বিস্তারিত

</a>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card h-100">

<div class="card-body">

<h5 class="fw-bold">

🕌 মাসিক পরীক্ষা

</h5>

<p>

আগামী শুক্রবার মাসিক পরীক্ষা অনুষ্ঠিত হবে।

</p>

<a href="#" class="btn btn-primary">

বিস্তারিত

</a>

</div>

</div>

</div>

<div class="col-lg-4">

<div class="card h-100">

<div class="card-body">

<h5 class="fw-bold">

🎉 বার্ষিক অনুষ্ঠান

</h5>

<p>

বার্ষিক পুরস্কার বিতরণী অনুষ্ঠান আগামী মাসে অনুষ্ঠিত হবে।

</p>

<a href="#" class="btn btn-primary">

বিস্তারিত

</a>

</div>

</div>

</div>

</div>

</div>

</section>

`;

}
// ======================================
// GALLERY SECTION
// ======================================

function loadGallery(){

document.getElementById("gallery").innerHTML=`

<section class="py-5 bg-light">

<div class="container">

<div class="text-center mb-5">

<h2 class="section-title">

আমাদের গ্যালারি

</h2>

<p class="text-muted">

মাদরাসার বিভিন্ন কার্যক্রমের কিছু ছবি

</p>

</div>

<div class="row g-4">

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery1.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>কুরআন ক্লাস</h5>

</div>

</div>

</div>

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery2.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>হিফজ বিভাগ</h5>

</div>

</div>

</div>

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery3.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>বার্ষিক অনুষ্ঠান</h5>

</div>

</div>

</div>

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery4.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>পরীক্ষা</h5>

</div>

</div>

</div>

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery5.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>পুরস্কার বিতরণ</h5>

</div>

</div>

</div>

<div class="col-lg-4 col-md-6">

<div class="card">

<img
src="images/gallery6.jpg"
class="gallery-img">

<div class="card-body text-center">

<h5>দোয়া মাহফিল</h5>

</div>

</div>

</div>

</div>

</div>

</section>

`;

}
// ======================================
// CONTACT SECTION
// ======================================

function loadContact(){

document.getElementById("contact").innerHTML=`

<section class="py-5">

<div class="container">

<div class="row">

<div class="col-lg-6">

<h2 class="section-title">

যোগাযোগ করুন

</h2>

<div class="contact-box">

<p>

<i class="fa-solid fa-location-dot text-success"></i>

<strong>ঠিকানা:</strong><br>

ভল্লভপুর, দিঘুলী, চন্দ্রগঞ্জ, লক্ষ্মীপুর

</p>

<hr>

<p>

<i class="fa-solid fa-phone text-success"></i>

<strong>মোবাইল:</strong><br>

+8801XXXXXXXXX

</p>

<hr>

<p>

<i class="fa-solid fa-envelope text-success"></i>

<strong>Email:</strong><br>

info@madrasa.com

</p>

</div>

</div>

<div class="col-lg-6">

<iframe

src="https://maps.google.com/maps?q=Lakshmipur&t=&z=13&ie=UTF8&iwloc=&output=embed"

width="100%"

height="350"

style="border:0;border-radius:15px;"

loading="lazy">

</iframe>

</div>

</div>

</div>

</section>

`;

}

// ======================================
// FOOTER
// ======================================

function loadFooter(){

document.getElementById("footer").innerHTML=`

<div class="container text-center">

<h5 class="mb-3">

🕌 মাদরাসায়ে নূরুল কুরআন

</h5>

<p>

© 2026 All Rights Reserved.

</p>

<p>

Developed by MZN Graphics Hub

</p>

</div>

`;

}



