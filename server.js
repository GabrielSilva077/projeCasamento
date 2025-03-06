// Importando as dependências
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const validator = require("validator"); // Adicionei o validator para validar os dados de entrada
dotenv.config();

// Criando uma instância do express
const app = express();

// Configuração do armazenamento de arquivos (onde a imagem será salva)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Salva na pasta 'uploads/'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

// Configurando o multer para lidar com o envio de imagens
const upload = multer({ storage: storage });

// Configurando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost", // Host do MySQL
  user: "root", // Usuário do MySQL
  password: "S&n@99pvsFzxx", // Senha do MySQL
  database: "ListaDePresentes", // Nome do banco de dados
});

// Verificando se a conexão com o banco de dados foi bem-sucedida
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
    return;
  }
  console.log("Conectado ao banco de dados com sucesso!");
});

// Criando pasta para upload de imagens caso não exista
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Habilitar CORS
app.use(cors());

// Para aceitar dados JSON no corpo da requisição
app.use(express.json());

// Serve arquivos estáticos da pasta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota para obter todos os presentes (incluindo o caminho da imagem)
app.get("/presentes", (req, res) => {
  const query = "SELECT * FROM presentes";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar presentes.");
    }

    // Atualiza o caminho da imagem com a URL completa
    results.forEach((item) => {
      if (item.imagem) {
        item.imagemUrl = `http://127.0.0.1:3000/uploads/${item.imagem}`; // Caminho completo da imagem
      }
    });

    res.json(results); // Retorna os dados em formato JSON
  });
});


// Rota para realizar a compra de um item
app.post("/comprar/:id", (req, res) => {
  const id = req.params.id;
  const { quantidade } = req.body;

  // Verifica se a quantidade foi fornecida e é válida
  if (!quantidade || quantidade <= 0) {
    return res.status(400).send("Quantidade inválida.");
  }

  const checkQuery =
    "SELECT quantidade_estoque, disponivel FROM presentes WHERE id = ?";
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao verificar o item.");
    }

    const item = results[0];

    if (!item.disponivel || item.quantidade_estoque <= 0) {
      return res.status(400).send("Item indisponível para compra.");
    }

    // Verifica se a quantidade solicitada é maior que o estoque disponível
    if (quantidade > item.quantidade_estoque) {
      return res
        .status(400)
        .send("Quantidade solicitada excede o estoque disponível.");
    }

    // Atualiza o estoque com a nova quantidade
    const updateQuery =
      "UPDATE presentes SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?";
    db.query(updateQuery, [quantidade, id], (err) => {
      if (err) {
        return res.status(500).send("Erro ao atualizar o estoque.");
      }
      res.send("Compra realizada com sucesso!");
    });
  });
});

// Rota para finalizar a compra
app.post("/finalizar-compra", async (req, res) => {
  const items = req.body.itens;
  if (!Array.isArray(items)) {
    return res.status(400).send("Dados inválidos.");
  }

  try {
    await Promise.all(
      items.map(async (item) => {
        const { id, quantidade } = item;
        const [results] = await db.promise().query("SELECT quantidade_estoque FROM presentes WHERE id = ?", [id]);
        
        if (results.length === 0) {
          throw new Error(`Produto com ID ${id} não encontrado.`);
        }

        const produto = results[0];
        if (quantidade > produto.quantidade_estoque) {
          throw new Error(`Estoque insuficiente para o produto com ID ${id}.`);
        }

        await db.promise().query(
          "UPDATE presentes SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?",
          [quantidade, id]
        );
      })
    );

    res.send("Compra finalizada com sucesso!");
  } catch (error) {
    res.status(500).send(`Erro ao processar compra: ${error.message}`);
  }
});

// Configuração do Nodemailer para envio de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Logs detalhados de depuração
});

// Rota para receber o envio do formulário de e-mail
app.post("/enviar-email", (req, res) => {
  console.log("Enviando e-mail...", req.body); // Verifique os dados enviados

  const { nome, email, mensagem, itensCarrinho } = req.body;

  // Validações dos dados
  if (!nome || !email || !mensagem) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send("Email inválido.");
  }

  if (validator.contains(mensagem, "<script>")) {
    return res.status(400).send("Mensagem contém conteúdo malicioso.");
  }

  // Verifica se o carrinho está vazio
  if (!itensCarrinho || itensCarrinho.length === 0) {
    return res.status(400).send("Carrinho vazio.");
  }

  // Detalhes dos produtos no carrinho
  let carrinhoDetalhes = "Produtos no carrinho:\n";
  itensCarrinho.forEach((item) => {
    carrinhoDetalhes += `${item.nome} - Quantidade: ${item.quantidade} - Preço: R$${item.preco}\n`;
  });

  // Definindo as opções do e-mail
  const mailOptions = {
    from: email, // O e-mail do remetente
    to: process.env.RECIPIENT_EMAIL, // O e-mail do destinatário
    subject: `Mensagem de ${nome}`, // Assunto do e-mail
    text: `${mensagem}\n\n${carrinhoDetalhes}`, // Corpo do e-mail
  };

  // Enviar o e-mail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Erro ao enviar o e-mail:", err);
      return res.status(500).send("Erro ao enviar o e-mail.");
    }
    console.log("E-mail enviado:", info.response);

    // Se o e-mail for enviado com sucesso, diminuir o estoque dos produtos comprados
    itensCarrinho.forEach((item) => {
      const { id, quantidade } = item;

      // Atualiza a quantidade de estoque no banco de dados
      const updateQuery =
        "UPDATE presentes SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?";
      db.query(updateQuery, [quantidade, id], (err) => {
        if (err) {
          console.error(
            `Erro ao atualizar o estoque do produto com id ${id}:`,
            err
          );
          return res.status(500).send("Erro ao atualizar o estoque.");
        }
      });
    });

    res.status(200).send("E-mail enviado e estoque atualizado com sucesso!");
  });
});

// Iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para editar um produto
app.put("/editar/:id", upload.single("imagem"), (req, res) => {
  const id = req.params.id;
  const { nome, preco, quantidade_estoque, categoria, link_produto } = req.body;

  // Verifica se a imagem foi enviada
  let imagemUrl = null;
  if (req.file) {
    imagemUrl = req.file.filename; // O nome do arquivo da imagem
  }

  // A query de atualização considera a possibilidade de imagem nova
  let updateQuery =
    "UPDATE presentes SET nome = ?, preco = ?, quantidade_estoque = ?, categoria = ?, link_produto = ? WHERE id = ?";
  let queryParams = [
    nome,
    preco,
    quantidade_estoque,
    categoria,
    link_produto,
    id,
  ];

  // Se a imagem foi enviada, atualiza a imagem no banco
  if (imagemUrl) {
    updateQuery =
      "UPDATE presentes SET nome = ?, preco = ?, quantidade_estoque = ?, imagem = ?, categoria = ?, link_produto = ? WHERE id = ?";
    queryParams = [
      nome,
      preco,
      quantidade_estoque,
      imagemUrl,
      categoria,
      link_produto,
      id,
    ];
  }

  db.query(updateQuery, queryParams, (err) => {
    if (err) {
      return res.status(500).send("Erro ao editar o produto.");
    }

    res.send("Produto editado com sucesso!");
  });
});

// Rota para excluir um produto
app.delete("/excluir/:id", (req, res) => {
  const id = req.params.id;

  const deleteQuery = "DELETE FROM presentes WHERE id = ?";
  db.query(deleteQuery, [id], (err) => {
    if (err) {
      return res.status(500).send("Erro ao excluir o produto.");
    }

    res.send("Produto excluído com sucesso!");
  });
});

app.post("/adicionar", upload.single("imagem"), (req, res) => {
  console.log(req.body);  // Verifique os dados do corpo da requisição
  console.log(req.file);   // Verifique os dados da imagem

  const { nome, preco, quantidade, categoria, linkProduto } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const insertQuery =
    "INSERT INTO presentes (nome, preco, quantidade_estoque, imagem, categoria, link_produto) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    insertQuery,
    [nome, preco, quantidade, imagem, categoria, linkProduto],
    (err) => {
      if (err) {
        console.error("Erro ao adicionar o produto:", err);  // Verifique o erro
        return res.status(500).send("Erro ao adicionar o produto.");
      }

      res.send("Produto adicionado com sucesso!");
    }
  );
});
