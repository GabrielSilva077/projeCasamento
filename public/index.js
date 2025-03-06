// document.addEventListener("DOMContentLoaded", function () {
//   const links = document.querySelectorAll(
//     "a[href^='index.html#'], a[data-scroll-href]"
//   );

//   links.forEach((link) => {
//     link.addEventListener("click", function (event) {
//       event.preventDefault();

//       const targetId = this.getAttribute("href").split("#")[1];
//       const targetElement = document.getElementById(targetId);

//       if (targetElement) {
//         window.scrollTo({
//           top: targetElement.offsetTop,
//           behavior: "smooth",
//         });
//       } else {
//         // Caso o usuário esteja em outra página, redireciona para index.html normalmente
//         window.location.href = `index.html#${targetId}`;
//       }
//     });
//   });
// });

// window.onload = () => {
//   document.body.style.animation = "subir 1s ease-out forwards";
// };

// sidebar
var btn = document.querySelector("#btn");
var sidebar = document.querySelector(".sidebar");
var searchBtn = document.querySelector(".bx-search");
var navList = document.querySelector(".nav-list");

btn.onclick = function () {
  sidebar.classList.toggle("active");
  navList.classList.toggle("active");
};

searchBtn.onclick = function () {
  sidebar.classList.toggle("active");
  navList.classList.toggle("active");
};

//ordenar preço
// Captura o elemento select e a lista de produtos
const sortSelect = document.getElementById("sort");
const productList = document.getElementById("productList");

// Adiciona o evento de mudança no filtro
sortSelect.addEventListener("change", function () {
  const sortOption = this.value; // Pega a opção selecionada
  const products = Array.from(productList.querySelectorAll(".card_prod-g")); // Todos os produtos

  // Ordena os produtos com base no valor do atributo data-price
  products.sort((a, b) => {
    const priceA = parseFloat(a.getAttribute("data-price"));
    const priceB = parseFloat(b.getAttribute("data-price"));

    return sortOption === "low-to-high" ? priceA - priceB : priceB - priceA;
  });

  // Reordena os produtos no DOM
  products.forEach((product) => productList.appendChild(product));
});
