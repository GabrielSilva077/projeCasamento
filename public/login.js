document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazena informação de login bem-sucedido
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = "adm.html";
      } else {
        document.getElementById("errorMessage").textContent = data.message;
      }
    } catch (error) {
      console.error("Erro ao tentar logar:", error);
      document.getElementById("errorMessage").textContent = "Erro ao tentar logar.";
    }
  });
