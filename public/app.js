const abrirFormularioEdicao = (presente) => {
  console.log("Abrindo formulário de edição para o produto", presente);

  const modal = document.createElement("div");
  modal.id = "modal-edicao";

  const formulario = document.createElement("form");
  formulario.id = "form-edicao";

  formulario.innerHTML = `
    <h2>Editar Produto</h2>
    <label for="nome">Nome</label>
    <input type="text" id="nome" value="${presente.nome}" required><br>

    <label for="preco">Preço</label>
    <input type="number" id="preco" value="${presente.preco}" required><br>

    <label for="quantidade">Quantidade</label>
    <input type="number" id="quantidade" value="${
      presente.quantidade_estoque
    }" required><br>

    <!-- Alterando para um campo de upload de imagem -->
    <label for="imagem">Imagem</label>
    <input type="file" id="imagem"><br>
    
    <!-- Exibindo a imagem atual, caso exista -->
    ${
      presente.imagemUrl
        ? `<img id="imagem-preview" src="${presente.imagemUrl}" alt="Imagem atual" style="max-width: 200px; max-height: 200px;"><br>`
        : ""
    }

<label for="categoria">Categoria</label>
<select id="categoria" required>
  <option value="🍽️ Cozinha – Utensílios Gerais" ${
    presente.categoria === "🍽️ Cozinha – Utensílios Gerais" ? "selected" : ""
  }>🍽️ Cozinha – Utensílios Gerais</option>
  <option value="🍳 Cozinha – Panelas e Formas" ${
    presente.categoria === "🍳 Cozinha – Panelas e Formas" ? "selected" : ""
  }>🍳 Cozinha – Panelas e Formas</option>
  <option value="🍴 Cozinha – Talheres e Louças" ${
    presente.categoria === "🍴 Cozinha – Talheres e Louças" ? "selected" : ""
  }>🍴 Cozinha – Talheres e Louças</option>
  <option value="🧂 Cozinha – Organização e Armazenamento" ${
    presente.categoria === "🧂 Cozinha – Organização e Armazenamento"
      ? "selected"
      : ""
  }>🧂 Cozinha – Organização e Armazenamento</option>
  <option value="🔌 Eletrodomésticos Pequenos" ${
    presente.categoria === "🔌 Eletrodomésticos Pequenos" ? "selected" : ""
  }>🔌 Eletrodomésticos Pequenos</option>
  <option value="🧹 Limpeza e Lavanderia" ${
    presente.categoria === "🧹 Limpeza e Lavanderia" ? "selected" : ""
  }>🧹 Limpeza e Lavanderia</option>
  <option value="🧺 Lavanderia – Cuidados com Roupas" ${
    presente.categoria === "🧺 Lavanderia – Cuidados com Roupas"
      ? "selected"
      : ""
  }>🧺 Lavanderia – Cuidados com Roupas</option>
  <option value="🚿 Banheiro e Têxteis" ${
    presente.categoria === "🚿 Banheiro e Têxteis" ? "selected" : ""
  }>🚿 Banheiro e Têxteis</option>
  <option value="🥗 Servir e Decorar" ${
    presente.categoria === "🥗 Servir e Decorar" ? "selected" : ""
  }>🥗 Servir e Decorar</option>
</select><br>



    <label for="linkProduto">Link do Produto</label>
    <input type="url" id="linkProduto" value="${presente.link_produto}" ><br>

    <button type="submit">Salvar Alterações</button>
    <button type="button" onclick="fecharModal()">Cancelar</button>
  `;

  modal.appendChild(formulario);
  document.body.appendChild(modal);

  // Preencher as informações do produto no formulário
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade_estoque = document.getElementById("quantidade").value;
    const categoria = document.getElementById("categoria").value;
    const link_produto = document.getElementById("linkProduto").value;
    const imagem = document.getElementById("imagem").files[0]; // Aqui pega a nova imagem (se houver)

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("quantidade_estoque", quantidade_estoque);
    formData.append("categoria", categoria);
    formData.append("link_produto", link_produto);
    if (imagem) {
      formData.append("imagem", imagem); // Se uma nova imagem foi escolhida
    }

    fetch(`http://localhost:3000/editar/${presente.id}`, {
      method: "PUT",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        alert("Produto editado com sucesso!");
        fecharModal();
      } else {
        alert("Erro ao editar o produto.");
      }
    });
  });
};

// Função para fechar o modal
const fecharModal = () => {
  const modal = document.getElementById("modal-edicao");
  modal.remove();
};

// Função para fechar o formulário de edição
const fecharFormularioEdicao = () => {
  const modal = document.getElementById("modal-edicao");
  if (modal) modal.remove();
};
// Função para excluir um produto
const excluirProduto = (id, item) => {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    fetch(`http://localhost:3000/excluir/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        item.remove();
      })
      .catch((error) => {
        alert("Erro ao excluir o produto.");
        console.error("Erro:", error);
      });
  }
};

// Função para abrir o formulário de cadastro de novo produto
const abrirFormularioCadastro = () => {
  const formulario = document.createElement("form");
  formulario.id = "form-cadastro";

  formulario.innerHTML = `
    <h2>Cadastrar Novo Produto</h2>
    <label for="nome">Nome</label>
    <input type="text" id="nome" required><br>

    <label for="preco">Preço</label>
    <input type="number" id="preco" required><br>

    <label for="quantidade">Quantidade</label>
    <input type="number" id="quantidade" required><br>

    <label for="imagem">Imagem</label>
    <input type="file" id="imagem" required><br>

    <label for="categoria">Categoria</label>
    <select id="categoria" required>
      <option value="Utensílios de Cozinha">Utensílios de Cozinha</option>
      <option value="Eletrodomésticos">Eletrodomésticos</option>
      <option value="Louças e Talheres">Louças e Talheres</option>
      <option value="Itens de Armazenamento">Itens de Armazenamento</option>
      <option value="Decoração para Cozinha">Decoração para Cozinha</option>
      <option value="Produtos para Preparação de Alimentos">Produtos para Preparação de Alimentos</option>
      <option value="Itens para Bebidas">Itens para Bebidas</option>
    </select><br>

    <label for="linkProduto">Link do Produto</label>
    <input type="text" id="linkProduto" ><br>

    <button type="submit">Salvar</button>
    <button type="button" onclick="fecharFormularioCadastro()">Cancelar</button>
  `;

  document.body.appendChild(formulario);

  formulario.onsubmit = (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;
    const imagem = document.getElementById("imagem").files[0];
    const categoria = document.getElementById("categoria").value;
    const linkProduto = document.getElementById("linkProduto").value;

    console.log({ nome, preco, quantidade, imagem, categoria, linkProduto }); // Verificar no console

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("quantidade", quantidade);
    formData.append("imagem", imagem);
    formData.append("categoria", categoria);
    formData.append("linkProduto", linkProduto);

    fetch("http://localhost:3000/adicionar", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fecharFormularioCadastro();
        location.reload();
      })
      .catch((error) => {
        alert("Erro ao cadastrar o produto.");
        console.error("Erro:", error);
      });
  };
};

// Função para fechar o formulário de cadastro
const fecharFormularioCadastro = () => {
  const formulario = document.getElementById("form-cadastro");
  if (formulario) formulario.remove();
};


function adicionarAoCarrinho(presente, quantidade) {
  // Chama o back-end para verificar e diminuir o estoque antes de adicionar ao carrinho
  fetch(`http://localhost:3000/comprar/${presente.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantidade: quantidade }),
  })
    .then((response) => response.text()) // Use .text() para capturar mensagens do servidor
    .then((data) => {
      if (data === "Compra realizada com sucesso!") {
        // Se a compra for confirmada pelo servidor, adiciona ao carrinho
        const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        // Verifica se o produto já está no carrinho
        const produtoExistente = carrinho.find(
          (item) => item.id === presente.id
        );

        if (produtoExistente) {
          // Caso o produto já esteja no carrinho, remove o tempo associado no localStorage
          localStorage.removeItem(`tempoFinal-${presente.id}`);

          // Atualiza a quantidade do produto no carrinho
          produtoExistente.quantidade += quantidade;
        } else {
          // Adiciona um novo produto ao carrinho
          carrinho.push({
            id: presente.id,
            nome: presente.nome,
            preco: presente.preco,
            quantidade: quantidade,
            imagemUrl: presente.imagemUrl,
          });
        }

        // Adiciona o tempo de adição do carrinho
        const dataAtual = new Date();
        const tempoLimite = 40 * 60 * 1000; // 40 minutos em milissegundos
        const dataLimite = new Date(dataAtual.getTime() + tempoLimite);

        // Armazena o carrinho e a data limite no localStorage
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        localStorage.setItem(`tempoFinal-${presente.id}`, dataLimite.getTime());
      } else {
        // Se o produto não estiver disponível, exibe o alerta e NÃO adiciona ao carrinho
        alert(data);
      }
    })
    .catch((error) => {
      console.error("Erro ao tentar atualizar o estoque:", error);
      alert("Erro ao tentar atualizar o estoque.");
    });
}

function criarModal(presente) {

  const modalExistente = document.querySelector(".modal-container");
  if (modalExistente) {
    modalExistente.remove();
  }

  // Cria o container da modal
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  // Cria o conteúdo da modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Cria o container da imagem
  const imagemContainer = document.createElement("div");
  imagemContainer.classList.add("imagem-container");

  // Cria a imagem do produto
  const imagem = document.createElement("img");
  imagem.src = presente.imagemUrl;
  imagem.alt = presente.nome;
  imagem.classList.add("modal-imagem");

  // Adiciona a imagem dentro do container
  imagemContainer.appendChild(imagem);

  // Cria o container para os outros itens (nome, preço, quantidade, etc.)
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  // Nome do produto
  const modalTitle = document.createElement("h2");
  modalTitle.textContent = presente.nome;

  // Preço do produto
  const modalPreco = document.createElement("p");
  modalPreco.textContent = `Preço: R$ ${presente.preco}`;

  // Quantidade disponível
  const modalQuantidade = document.createElement("p");
  modalQuantidade.textContent = `Disponível: ${presente.quantidade_estoque}`;

  // Adiciona o nome, preço e quantidade dentro do infoContainer
  infoContainer.appendChild(modalTitle);
  // infoContainer.appendChild(modalPreco);
  infoContainer.appendChild(modalQuantidade);

  // Verifica se o link do produto está cadastrado antes de criar o botão
  if (presente.link_produto) {
    const textoLink = document.createElement("p");
    textoLink.textContent = "Local sugerido para compra...";

    const modalLink = document.createElement("a");
    modalLink.href = presente.link_produto;
    modalLink.target = "_blank";
    modalLink.textContent =
      presente.link_produto.length > 30
        ? presente.link_produto.substring(0, 30) + "..."
        : presente.link_produto;

    // Adiciona o texto e link do produto após a quantidade disponível
    infoContainer.appendChild(textoLink);
    infoContainer.appendChild(modalLink);
  }

  // Input para selecionar a quantidade
  const inputQuantidade = document.createElement("input");
  inputQuantidade.type = "number";
  inputQuantidade.min = 1;
  inputQuantidade.max = presente.quantidade_estoque;
  inputQuantidade.value = 1;
  inputQuantidade.classList.add("quantidade-input");

  // Botão de adicionar ao carrinho
  const adicionarCarrinhoBtn = document.createElement("button");
  adicionarCarrinhoBtn.textContent = "Adicionar ao Carrinho";
  adicionarCarrinhoBtn.classList.add("modal-add-btn");

  // Se o produto estiver esgotado, desabilita o botão e adiciona a classe "esgotado"
  if (presente.quantidade_estoque <= 0) {
    adicionarCarrinhoBtn.disabled = true;
    adicionarCarrinhoBtn.textContent = "Esgotado";
    adicionarCarrinhoBtn.classList.add("esgotado"); // Adiciona a classe específica
  }

  // Evento para adicionar ao carrinho
  adicionarCarrinhoBtn.onclick = () => {
    const quantidadeSelecionada = parseInt(inputQuantidade.value);

    if (quantidadeSelecionada > presente.quantidade_estoque) {
      alert("Quantidade selecionada maior que o estoque disponível!");
      return;
    }

    // Adiciona ao carrinho (você pode definir essa função conforme sua lógica)
    adicionarAoCarrinho(presente, quantidadeSelecionada);

    // Feedback ao usuário
    alert(`Produto "${presente.nome}" adicionado ao carrinho.`);
  };

  // Botão de fechar a modal
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.classList.add("modal-close-button");

  // Evento para fechar a modal
  closeButton.onclick = () => {
    document.body.removeChild(modalContainer);
  };

  // Adiciona o input de quantidade e o botão de adicionar ao carrinho dentro do infoContainer
  infoContainer.appendChild(adicionarCarrinhoBtn);
  infoContainer.appendChild(closeButton);

  // Adiciona o container da imagem e o container das informações no conteúdo da modal
  modalContent.appendChild(imagemContainer);
  modalContent.appendChild(infoContainer);

  // Adiciona o conteúdo ao container da modal
  modalContainer.appendChild(modalContent);

  // Adiciona a modal ao body
  document.body.appendChild(modalContainer);
}

document.addEventListener("DOMContentLoaded", () => {
  const filtroCategoria = document.getElementById("filtro-categoria");
  const btnFiltrar = document.getElementById("btn-filtrar");
  const lista = document.getElementById("presentes-lista");
  const isAdminPage = window.location.pathname.includes("adm.html");
  let todosOsPresentes = [];

  // Função para exibir os produtos na lista
  function exibirPresentes(listaPresentes) {
    lista.innerHTML = ""; // Limpa a lista antes de renderizar

    listaPresentes.forEach((presente) => {
      const item = document.createElement("div");
      item.classList.add("produto-card");

      const imagem = document.createElement("img");
      imagem.src = presente.imagemUrl;
      imagem.alt = presente.nome;
      imagem.width = 100;

      const nome = document.createElement("p");
      nome.textContent = presente.nome;

      const quantidade = document.createElement("p");
      quantidade.textContent = `Disponível: ${presente.quantidade_estoque}`;

      const preco = document.createElement("p");
      preco.textContent = `Preço: R$${presente.preco}`;

      item.appendChild(imagem);
      item.appendChild(nome);

      if (isAdminPage) {
        const categoria = document.createElement("p");
        categoria.textContent = `Categoria: ${presente.categoria}`;
        item.appendChild(categoria);
        item.appendChild(quantidade);
      }

      if (!isAdminPage) {
        const inputQuantidade = document.createElement("input");
        inputQuantidade.type = "number";
        inputQuantidade.min = 1;
        inputQuantidade.max = presente.quantidade_estoque;
        inputQuantidade.value = 1;
        inputQuantidade.classList.add("quantidade-input");

        const comprarBtn = document.createElement("button");
        comprarBtn.textContent = "Adicionar ao Carrinho";
        comprarBtn.classList.add("adicionar-carrinho");

        if (presente.quantidade_estoque <= 0) {
          comprarBtn.disabled = true;
          comprarBtn.textContent = "Esgotado";
          item.classList.add("esgotado");
        }

        comprarBtn.onclick = (event) => {
          event.stopPropagation();
          const quantidadeSelecionada = parseInt(inputQuantidade.value);

          if (quantidadeSelecionada > presente.quantidade_estoque) {
            alert("Quantidade selecionada maior que o estoque disponível!");
            return;
          }

          adicionarAoCarrinho(presente, quantidadeSelecionada);
          alert(`Produto "${presente.nome}" adicionado ao carrinho.`);
        };

        item.appendChild(comprarBtn);
      } else {
        const editarBtn = document.createElement("button");
        editarBtn.textContent = "Editar";
        editarBtn.onclick = () => abrirFormularioEdicao(presente);

        const excluirBtn = document.createElement("button");
        excluirBtn.textContent = "Excluir";
        excluirBtn.onclick = () => excluirProduto(presente.id, item);

        item.appendChild(editarBtn);
        item.appendChild(excluirBtn);
      }

      item.onclick = (event) => {
        if (!event.target.classList.contains("adicionar-carrinho")) {
          criarModal(presente);
        }
      };

      lista.appendChild(item);
    });
  }

  // Buscar os produtos do banco de dados
  fetch("http://localhost:3000/presentes")
    .then((response) => response.json())
    .then((data) => {
      todosOsPresentes = data;
      exibirPresentes(todosOsPresentes);
    })
    .catch((error) => console.error("Erro ao carregar os produtos:", error));

  // Evento para filtrar os produtos
  btnFiltrar.addEventListener("click", () => {
    const categoriaSelecionada = filtroCategoria.value;
    const presentesFiltrados =
      categoriaSelecionada === ""
        ? todosOsPresentes
        : todosOsPresentes.filter(
            (presente) => presente.categoria === categoriaSelecionada
          );
    exibirPresentes(presentesFiltrados);
  });
});