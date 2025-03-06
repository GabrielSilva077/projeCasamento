// Função para filtrar os produtos
const filtrarProdutos = () => {
  const nomeFiltro = document.getElementById("filtro-nome").value.toLowerCase();
  const categoriaFiltro = document.getElementById("filtro-categoria").value;

  fetch("http://localhost:3000/presentes")
    .then((response) => response.json())
    .then((data) => {
      const lista = document.getElementById("presentes-lista");
      lista.innerHTML = ""; // Limpar a lista antes de adicionar os produtos filtrados

      data.forEach((presente) => {
        // Verifica se o nome ou categoria do produto corresponde aos filtros
        if (
          (presente.nome.toLowerCase().includes(nomeFiltro) ||
            nomeFiltro === "") &&
          (presente.categoria === categoriaFiltro || categoriaFiltro === "")
        ) {
          const item = document.createElement("div"); // Usando "div" para cada card
          item.classList.add("produto-card"); // Adicionando uma classe para estilizar os cards

          const imagem = document.createElement("img");
          imagem.src = presente.imagemUrl;
          imagem.alt = presente.nome;
          imagem.width = 100;

          const nome = document.createElement("p");
          nome.textContent = presente.nome;

          const preco = document.createElement("p");
          preco.textContent = `Preço: R$ ${presente.preco}`;

          const botaoModal = document.createElement("button");
          botaoModal.textContent = "Ver Produto";
          botaoModal.onclick = () => criarModal(presente);

          item.appendChild(imagem);
          item.appendChild(nome);
          item.appendChild(preco);
          item.appendChild(botaoModal);

          // Adiciona o card à lista
          lista.appendChild(item);
        }
      });
    });
};

// Função para criar filtros de nome e categoria
const criarFiltros = () => {
  const filtroContainer = document.getElementById("filtro-container");

  // Filtro por nome
  const nomeFiltroInput = document.createElement("input");
  nomeFiltroInput.type = "text";
  nomeFiltroInput.id = "filtro-nome";
  nomeFiltroInput.placeholder = "Filtrar por nome";
  nomeFiltroInput.addEventListener("input", filtrarProdutos); // Filtra quando o usuário digita

  // Filtro por categoria
  const categoriaFiltroSelect = document.createElement("select");
  categoriaFiltroSelect.id = "filtro-categoria";
  const categorias = [
    "Todos",
    "Utensílios de Cozinha",
    "Eletrodomésticos",
    "Louças e Talheres",
    "Itens de Armazenamento",
    "Decoração para Cozinha",
    "Produtos para Preparação de Alimentos",
    "Itens para Bebidas",
  ];

  categorias.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoriaFiltroSelect.appendChild(option);
  });

  categoriaFiltroSelect.addEventListener("change", filtrarProdutos); // Filtra quando a categoria é alterada

  filtroContainer.appendChild(nomeFiltroInput);
  filtroContainer.appendChild(categoriaFiltroSelect);
};

// Chama a função para criar filtros assim que a página carrega
criarFiltros();

// Exibe os produtos inicialmente sem filtro
filtrarProdutos();
