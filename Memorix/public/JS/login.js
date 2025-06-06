document.addEventListener("DOMContentLoaded", () => {
    // Alternar visibilidade da senha
    document.querySelector("#mostrar").addEventListener("change", function() {
        const senhaInput = document.querySelector("#senha");
        senhaInput.type = this.checked ? "text" : "password";
    });

    // Processo de login
    document.querySelector("#dados").addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;

        try {
            const response = await fetch("http://localhost:3000/logar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (data.success) {
                // 💾 Salva o ID do usuário no localStorage
                localStorage.setItem("usuario_id", data.usuario_id);
                alert("Login realizado com sucesso!");

                // Redireciona para a página principal
                window.location.href = "home.html";
            } else {
                alert("Email ou senha incorretos. Tente novamente.");
            }
        } catch (error) {
            alert("Erro ao conectar-se ao servidor!");
            console.error("Erro na requisição:", error);
        }
    });
});