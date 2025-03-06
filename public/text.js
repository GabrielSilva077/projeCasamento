const frases = [
  "Ajude a montar o nosso novo lar.",
  "Seu presente, nossa felicidade.",
  "Transformando o novo lar.",
  "Cada detalhe importa",
  "Seu presente, nosso sorriso.",
];

const textoElement = document.getElementById("texto");
let fraseIndex = 0;
let letraIndex = 0;
let isApagando = false;

function escreverTexto() {
  if (letraIndex < frases[fraseIndex].length) {
    textoElement.textContent += frases[fraseIndex][letraIndex];
    letraIndex++;
    setTimeout(escreverTexto, 100); // Atraso para o efeito de digitação
  } else {
    setTimeout(apagarTexto, 1500); // Atraso antes de começar a apagar
  }
}

function apagarTexto() {
  if (letraIndex > 0 && isApagando) {
    textoElement.textContent = frases[fraseIndex].substring(0, letraIndex - 1);
    letraIndex--;
    setTimeout(apagarTexto, 100); // Atraso para o efeito de apagamento
  } else {
    isApagando = !isApagando; // Alterna entre apagar e escrever
    if (!isApagando) {
      fraseIndex = (fraseIndex + 1) % frases.length; // Vai para a próxima frase
      setTimeout(escreverTexto, 500); // Pequeno delay antes de começar a escrever novamente
    } else {
      setTimeout(apagarTexto, 1000); // Espera um pouco antes de começar a apagar de novo
    }
  }
}

// Inicia a animação ao carregar a página
escreverTexto();

window.addEventListener("load", function () {
  if (window.innerWidth < 768) {
    // Para dispositivos móveis
    document.querySelectorAll(".anima-section").forEach(function (element) {
      element.setAttribute("data-aos-offset", "-50"); // Valor negativo para ativar bem antes
    });
  } else {
    document.querySelectorAll(".anima-section").forEach(function (element) {
      element.setAttribute("data-aos-offset", "100"); // Para desktop
    });
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth < 768) {
    document.querySelectorAll(".anima-section").forEach(function (element) {
      element.setAttribute("data-aos-offset", "-50");
    });
  } else {
    document.querySelectorAll(".anima-section").forEach(function (element) {
      element.setAttribute("data-aos-offset", "100");
    });
  }
});
