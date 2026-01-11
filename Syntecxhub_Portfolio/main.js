const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
});





const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});




const text = "Frontend Developer | HTML • CSS • Responsive Design";
let i = 0;
const el = document.querySelector(".typing");

function type() {
  if (i < text.length) {
    el.textContent += text.charAt(i);
    i++;
    setTimeout(type, 60);
  }
}
type();




window.addEventListener("scroll", () => {
  document.querySelector(".header")
    .classList.toggle("scrolled", window.scrollY > 50);
});
