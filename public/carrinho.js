document.addEventListener("DOMContentLoaded", function () {
  // Recupera o carrinho do LocalStorage ou cria um vazio
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  // Elemento onde os itens do carrinho serão exibidos
  const itensCarrinhoElement = document.getElementById("itens-carrinho");

  // Função para renderizar os itens do carrinho
  function renderizarCarrinho() {
    itensCarrinhoElement.innerHTML = ""; // Limpa a exibição atual

    if (carrinho.length === 0) {
      itensCarrinhoElement.innerHTML = "<p>Carrinho vazio</p>";
      return;
    }

    carrinho.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("item-carrinho");

      itemElement.innerHTML = `
      <img src="${item.imagemUrl}" alt="${item.nome}" class="imagem-carrinho" />
      <div class="detalhes-item">
        <p>${item.nome}</p>
        <label for="quantidade-${item.id}">Quantidade:</label>
        <input type="number" id="quantidade-${item.id}" value="${item.quantidade}" min="1" max="${item.estoque}" />
        <button class="btn-excluir" data-index="${index}">Excluir</button>
      </div>
      <div id="cronometro-${item.id}" class="cronometro">
        Tempo restante: <span id="tempo-restante-${item.id}">00:00</span>
      </div>
    `;

      itensCarrinhoElement.appendChild(itemElement);

      // Atualiza a quantidade ao mudar o campo de input
      const quantidadeInput = document.getElementById(`quantidade-${item.id}`);
      quantidadeInput.addEventListener("change", function () {
        let novaQuantidade = parseInt(quantidadeInput.value);
        if (novaQuantidade > item.estoque) {
          novaQuantidade = item.estoque;
          alert("Quantidade não pode ultrapassar o estoque disponível.");
        }
        item.quantidade = novaQuantidade;
        salvarCarrinho();
      });

      // Botão de exclusão
      const btnExcluir = itemElement.querySelector(".btn-excluir");
      btnExcluir.addEventListener("click", function () {
        excluirItem(index);
      });

      // Verifica o tempo limite do item e inicia o cronômetro
      const limiteCarrinho = localStorage.getItem("dataLimiteCarrinho");
      iniciarCronometro(item.id, new Date(limiteCarrinho));
    });
  }

  // Função para iniciar o cronômetro para cada item
  function iniciarCronometro(itemId, limiteCarrinho) {
    const tempoRestanteElement = document.getElementById(
      `tempo-restante-${itemId}`
    );

    // Calcula o tempo restante
    const agora = new Date();
    let tempoRestante = Math.floor((limiteCarrinho - agora) / 1000); // Em segundos

    const interval = setInterval(() => {
      const minutos = Math.floor(tempoRestante / 60);
      const segundos = tempoRestante % 60;
      tempoRestanteElement.textContent = `${formatarTempo(
        minutos
      )}:${formatarTempo(segundos)}`;

      if (tempoRestante <= 0) {
        clearInterval(interval); // Para o cronômetro
        alert(`O tempo para finalizar a compra do item foi expirado.`);
        // Aqui você pode adicionar a lógica para expirar o item do carrinho
      } else {
        tempoRestante--; // Decrementa o tempo
      }
    }, 1000);
  }

  // Função para formatar o tempo para dois dígitos (ex: 03:09)
  function formatarTempo(tempo) {
    return tempo < 10 ? `0${tempo}` : tempo;
  }

  // Função para excluir um item do carrinho
  function excluirItem(index) {
    carrinho.splice(index, 1); // Remove o item pelo índice
    salvarCarrinho();
    renderizarCarrinho(); // Atualiza a exibição do carrinho
  }

  // Função para salvar o carrinho no LocalStorage
  function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  }

  // Função para iniciar o cronômetro para cada item
  function iniciarCronometro(itemId) {
    const tempoRestanteElement = document.getElementById(
      `tempo-restante-${itemId}`
    );
    let tempoRestante = 300; // 5 minutos (300 segundos)

    const interval = setInterval(() => {
      const minutos = Math.floor(tempoRestante / 60);
      const segundos = tempoRestante % 60;
      tempoRestanteElement.textContent = `${formatarTempo(
        minutos
      )}:${formatarTempo(segundos)}`;

      if (tempoRestante <= 0) {
        clearInterval(interval); // Para o cronômetro
        alert(`O tempo para finalizar a compra do item foi expirado.`);
        // Você pode adicionar aqui a lógica de expiração do item ou do carrinho
      } else {
        tempoRestante--; // Decrementa o tempo
      }
    }, 1000);
  }

  // Função para formatar o tempo para dois dígitos (ex: 03:09)
  function formatarTempo(tempo) {
    return tempo < 10 ? `0${tempo}` : tempo;
  }

  // Renderiza os itens do carrinho ao carregar a página
  renderizarCarrinho();

  // Função para exibir a modal de sucesso
  function exibirModalSucesso() {
    const modal = document.getElementById("modal-sucesso");
    const btnOk = document.getElementById("btn-ok");

    // Exibe a modal
    modal.style.display = "flex";

    // Ao clicar no botão "Ok", redireciona para o index.html
    btnOk.addEventListener("click", function () {
      window.location.href = "index.html"; // Redireciona para o index
    });
  }

  // Função para exibir erro caso o carrinho esteja vazio
  function exibirErroCarrinhoVazio() {
    const erroModal = document.getElementById("modal-erro");
    erroModal.style.display = "flex"; // Exibe a modal de erro

    const btnOk = erroModal.querySelector("#btn-ok-erro");
    btnOk.addEventListener("click", function () {
      erroModal.style.display = "none"; // Fecha a modal de erro
    });
  }

  // Funcionalidade do botão de finalizar compra (presentear)
  const btnFinalizar = document.querySelector(".btn-final");
  const formContainer = document.getElementById("form-container");

  btnFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
      exibirErroCarrinhoVazio(); // Exibe a modal de erro se o carrinho estiver vazio
      return; // Impede que o formulário de finalização seja mostrado
    }

    // Verifica se algum item do carrinho possui quantidade maior que o estoque
    for (let item of carrinho) {
      if (item.quantidade > item.estoque) {
        alert(
          `A quantidade do item "${item.nome}" não pode ser maior que o estoque disponível.`
        );
        return; // Impede que a finalização continue
      }
    }

    // Alterna a exibição do formulário
    formContainer.classList.toggle("active");

    // Adiciona ou remove a classe "form-active" no body
    if (formContainer.classList.contains("active")) {
      document.body.classList.add("form-active");
    } else {
      document.body.classList.remove("form-active");
    }
  });

  // Enviar dados do carrinho junto com o formulário de email
  const form = document.getElementById("form-email");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    // Cria uma string com os detalhes dos produtos do carrinho
    let carrinhoDetalhes = "Produtos no carrinho:\n";
    carrinho.forEach((item) => {
      carrinhoDetalhes += `${item.nome}  `;
    });

    const emailData = {
      nome,
      email,
      mensagem: `${mensagem}\n\n${carrinhoDetalhes}`,
      itensCarrinho: carrinho,
    };

    // Envia os dados do carrinho para o back-end
    fetch("http://127.0.0.1:3000/enviar-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Resposta do servidor:", data);

        // Exibe a modal de sucesso
        exibirModalSucesso();

        // Limpa o carrinho local após o envio do e-mail e finalização da compra
        localStorage.removeItem("carrinho");
        carrinho = [];
        renderizarCarrinho(); // Atualiza a exibição dos itens no carrinho
      })
      .catch((error) => {
        console.error("Erro ao enviar email:", error);
        alert("Houve um erro ao enviar o email.");
      });
  });

  // Funcionalidade do botão de cancelar
  const cancelarBtn = document.getElementById("cancelar-btn");
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", function () {
      // Limpar os campos do formulário
      document.getElementById("form-email").reset();

      // Remover a classe "form-active" do body para desfazer o fundo borrado
      document.body.classList.remove("form-active");

      // Opcional: Fechar o formulário
      formContainer.classList.remove("active"); // Esconde o formulário
    });
  }
});

















// document.addEventListener("DOMContentLoaded", function () {
//   // Recupera o carrinho do LocalStorage ou cria um vazio
//   let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

//   // Elemento onde os itens do carrinho serão exibidos
//   const itensCarrinhoElement = document.getElementById("itens-carrinho");

//   // Função para renderizar os itens do carrinho
//   function renderizarCarrinho() {
//     itensCarrinhoElement.innerHTML = ""; // Limpa a exibição atual

//     if (carrinho.length === 0) {
//       itensCarrinhoElement.innerHTML = "<p>Carrinho vazio</p>";
//       return;
//     }

//     carrinho.forEach((item, index) => {
//       const itemElement = document.createElement("div");
//       itemElement.classList.add("item-carrinho");

//       itemElement.innerHTML = `
//       <img src="${item.imagemUrl}" alt="${item.nome}" class="imagem-carrinho" />
//       <div class="detalhes-item">
//         <p>${item.nome}</p>
//         <label for="quantidade-${item.id}">Quantidade:</label>
//         <input type="number" id="quantidade-${item.id}" value="${item.quantidade}" min="1" max="${item.estoque}" />
//         <button class="btn-excluir" data-index="${index}">Excluir</button>
//       </div>
//       <div id="cronometro-${item.id}" class="cronometro">
//         Tempo restante: <span id="tempo-restante-${item.id}">00:00</span>
//       </div>
//     `;

//       itensCarrinhoElement.appendChild(itemElement);

//       // Atualiza a quantidade ao mudar o campo de input
//       const quantidadeInput = document.getElementById(`quantidade-${item.id}`);
//       quantidadeInput.addEventListener("change", function () {
//         let novaQuantidade = parseInt(quantidadeInput.value);
//         if (novaQuantidade > item.estoque) {
//           novaQuantidade = item.estoque;
//           alert("Quantidade não pode ultrapassar o estoque disponível.");
//         }
//         item.quantidade = novaQuantidade;
//         salvarCarrinho();
//       });

//       // Botão de exclusão
//       const btnExcluir = itemElement.querySelector(".btn-excluir");
//       btnExcluir.addEventListener("click", function () {
//         excluirItem(index);
//       });

//       // Recupera a data limite do carrinho armazenada no localStorage
//       const limiteCarrinho = new Date(localStorage.getItem("dataLimiteCarrinho"));
//       console.log('Data Limite Carrinho:', limiteCarrinho);
      
//       // Inicia o cronômetro para cada item
//       iniciarCronometro(item.id, limiteCarrinho);
//     });
//   }

//   // Função para iniciar o cronômetro para cada item
//   function iniciarCronometro(itemId, limiteCarrinho) {
//     const tempoRestanteElement = document.getElementById(
//       `tempo-restante-${itemId}`
//     );

//     // Calcula o tempo restante
//     const agora = new Date();
//     let tempoRestante = Math.floor((limiteCarrinho - agora) / 1000); // Em segundos

//     const interval = setInterval(() => {
//       const minutos = Math.floor(tempoRestante / 60);
//       const segundos = tempoRestante % 60;
//       tempoRestanteElement.textContent = `${formatarTempo(
//         minutos
//       )}:${formatarTempo(segundos)}`;

//       if (tempoRestante <= 0) {
//         clearInterval(interval); // Para o cronômetro
//         alert(`O tempo para finalizar a compra do item foi expirado.`);
//         // Aqui você pode adicionar a lógica para expirar o item do carrinho
//       } else {
//         tempoRestante--; // Decrementa o tempo
//       }
//     }, 1000);
//   }

//   // Função para formatar o tempo para dois dígitos (ex: 03:09)
//   function formatarTempo(tempo) {
//     return tempo < 10 ? `0${tempo}` : tempo;
//   }

//   // Função para excluir um item do carrinho
//   function excluirItem(index) {
//     carrinho.splice(index, 1); // Remove o item pelo índice
//     salvarCarrinho();
//     renderizarCarrinho(); // Atualiza a exibição do carrinho
//   }

//   // Função para salvar o carrinho no LocalStorage
//   function salvarCarrinho() {
//     localStorage.setItem("carrinho", JSON.stringify(carrinho));
//   }

//   // Função para iniciar o cronômetro para cada item
//   function iniciarCronometro(itemId) {
//     const tempoRestanteElement = document.getElementById(
//       `tempo-restante-${itemId}`
//     );
//     let tempoRestante = 300; // 5 minutos (300 segundos)

//     const interval = setInterval(() => {
//       const minutos = Math.floor(tempoRestante / 60);
//       const segundos = tempoRestante % 60;
//       tempoRestanteElement.textContent = `${formatarTempo(
//         minutos
//       )}:${formatarTempo(segundos)}`;

//       if (tempoRestante <= 0) {
//         clearInterval(interval); // Para o cronômetro
//         alert(`O tempo para finalizar a compra do item foi expirado.`);
//         // Você pode adicionar aqui a lógica de expiração do item ou do carrinho
//       } else {
//         tempoRestante--; // Decrementa o tempo
//       }
//     }, 1000);
//   }

//   // Função para formatar o tempo para dois dígitos (ex: 03:09)
//   function formatarTempo(tempo) {
//     return tempo < 10 ? `0${tempo}` : tempo;
//   }

//   // Renderiza os itens do carrinho ao carregar a página
//   renderizarCarrinho();

//   // Função para exibir a modal de sucesso
//   function exibirModalSucesso() {
//     const modal = document.getElementById("modal-sucesso");
//     const btnOk = document.getElementById("btn-ok");

//     // Exibe a modal
//     modal.style.display = "flex";

//     // Ao clicar no botão "Ok", redireciona para o index.html
//     btnOk.addEventListener("click", function () {
//       window.location.href = "index.html"; // Redireciona para o index
//     });
//   }

//   // Função para exibir erro caso o carrinho esteja vazio
//   function exibirErroCarrinhoVazio() {
//     const erroModal = document.getElementById("modal-erro");
//     erroModal.style.display = "flex"; // Exibe a modal de erro

//     const btnOk = erroModal.querySelector("#btn-ok-erro");
//     btnOk.addEventListener("click", function () {
//       erroModal.style.display = "none"; // Fecha a modal de erro
//     });
//   }

//   // Funcionalidade do botão de finalizar compra (presentear)
//   const btnFinalizar = document.querySelector(".btn-final");
//   const formContainer = document.getElementById("form-container");

//   btnFinalizar.addEventListener("click", () => {
//     if (carrinho.length === 0) {
//       exibirErroCarrinhoVazio(); // Exibe a modal de erro se o carrinho estiver vazio
//       return; // Impede que o formulário de finalização seja mostrado
//     }

//     // Verifica se algum item do carrinho possui quantidade maior que o estoque
//     for (let item of carrinho) {
//       if (item.quantidade > item.estoque) {
//         alert(
//           `A quantidade do item "${item.nome}" não pode ser maior que o estoque disponível.`
//         );
//         return; // Impede que a finalização continue
//       }
//     }

//     // Alterna a exibição do formulário
//     formContainer.classList.toggle("active");

//     // Adiciona ou remove a classe "form-active" no body
//     if (formContainer.classList.contains("active")) {
//       document.body.classList.add("form-active");
//     } else {
//       document.body.classList.remove("form-active");
//     }
//   });

//   // Enviar dados do carrinho junto com o formulário de email
//   const form = document.getElementById("form-email");
//   form.addEventListener("submit", function (event) {
//     event.preventDefault(); // Previne o envio padrão do formulário

//     // Coleta os dados do formulário
//     const nome = document.getElementById("nome").value;
//     const email = document.getElementById("email").value;
//     const mensagem = document.getElementById("mensagem").value;

//     // Cria uma string com os detalhes dos produtos do carrinho
//     let carrinhoDetalhes = "Produtos no carrinho:\n";
//     carrinho.forEach((item) => {
//       carrinhoDetalhes += `${item.nome}  `;
//     });

//     const emailData = {
//       nome,
//       email,
//       mensagem: `${mensagem}\n\n${carrinhoDetalhes}`,
//       itensCarrinho: carrinho,
//     };

//     // Envia os dados do carrinho para o back-end
//     fetch("http://127.0.0.1:3000/enviar-email", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(emailData),
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         console.log("Resposta do servidor:", data);

//         // Exibe a modal de sucesso
//         exibirModalSucesso();

//         // Limpa o carrinho local após o envio do e-mail e finalização da compra
//         localStorage.removeItem("carrinho");
//         carrinho = [];
//         renderizarCarrinho(); // Atualiza a exibição dos itens no carrinho
//       })
//       .catch((error) => {
//         console.error("Erro ao enviar email:", error);
//         alert("Houve um erro ao enviar o email.");
//       });
//   });

//   // Funcionalidade do botão de cancelar
//   const cancelarBtn = document.getElementById("cancelar-btn");
//   if (cancelarBtn) {
//     cancelarBtn.addEventListener("click", function () {
//       // Limpar os campos do formulário
//       document.getElementById("form-email").reset();

//       // Remover a classe "form-active" do body para desfazer o fundo borrado
//       document.body.classList.remove("form-active");

//       // Opcional: Fechar o formulário
//       formContainer.classList.remove("active"); // Esconde o formulário
//     });
//   }
// });
