// =============================
// Photo Preview
// =============================

const photoInput = document.getElementById("photo");

if (photoInput) {

  photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const preview = document.getElementById("photoPreview");

    preview.src = URL.createObjectURL(file);

    preview.classList.remove("d-none");

  });

}

// =============================
// Admission Form
// =============================

const admissionForm = document.getElementById("admissionForm");

if (admissionForm) {

  admissionForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    let photoUrl = "";

    const file = document.getElementById("photo").files[0];

    if (file) {

      const fileName = Date.now() + "_" + file.name;

      const { error: uploadError } =
        await window.supabaseClient.storage
          .from("students")
          .upload(fileName, file);

      if (uploadError) {

        console.error(uploadError);

        alert("ছবি Upload করা যায়নি");

        return;

      }

      const { data } =
        window.supabaseClient.storage
          .from("students")
          .getPublicUrl(fileName);

      photoUrl = data.publicUrl;

    }

    const student = {

      full_name: document.getElementById("full_name").value,

      father_name: document.getElementById("father_name").value,

      mother_name: document.getElementById("mother_name").value,

      mobile: document.getElementById("mobile").value,

      class: document.getElementById("class").value,

      address: document.getElementById("address").value,

      photo: photoUrl

    };

    const { error } = await window.supabaseClient
      .from("students")
      .insert([student]);

    if (error) {

      console.error(error);

      alert("❌ ভর্তি সংরক্ষণ করা যায়নি!");

      return;

    }

    alert("✅ ভর্তি আবেদন সফলভাবে জমা হয়েছে!");

    admissionForm.reset();

    document
      .getElementById("photoPreview")
      .classList.add("d-none");

  });

}

// ==========================
// Back To Top
// ==========================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

  if (window.scrollY > 300) {

    topBtn.style.display = "block";

  } else {

    topBtn.style.display = "none";

  }

});

topBtn.onclick = () => {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

};

// ==========================
// Navbar Shadow
// ==========================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {

    navbar.classList.add("scrolled");

  } else {

    navbar.classList.remove("scrolled");

  }

});
