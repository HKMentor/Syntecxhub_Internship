const cards = document.querySelectorAll(".faq-card");
const toggle = document.getElementById("themeToggle");
const search = document.getElementById("search");

/* Accordion */
cards.forEach(card => {
  card.querySelector(".faq-title").addEventListener("click", () => {
    cards.forEach(c => c !== card && c.classList.remove("active"));
    card.classList.toggle("active");
  });
});

/* Dark Mode */
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* Search */
search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  cards.forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
});
