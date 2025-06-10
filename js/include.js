function includeHTML(selector, file, callback) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("Dosya yüklenemedi: " + file);
      return response.text();
    })
    .then(data => {
      document.querySelector(selector).innerHTML = data;
      if (callback) callback(); // dosya yüklendikten sonra çalıştırılacak kod
    })
    .catch(err => console.error(err));
}

// Aktif linki belirle
function highlightActiveLink() {
  const links = document.querySelectorAll(".navbar .nav-link");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active", "text-white");
    } else {
      link.classList.remove("active");
    }
  });
}

// Sayfa yüklendiğinde çalıştır
window.addEventListener("DOMContentLoaded", () => {
  includeHTML("header", "partials/header.html", highlightActiveLink);
  includeHTML("footer", "partials/footer.html");
});
