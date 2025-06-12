document.querySelector("#mostrar").addEventListener("change", function() {
    const senhaInput = document.querySelector("#senha");
    senhaInput.type = this.checked ? "text" : "password";
});

document.querySelector("#dados").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;

    try {
        const response = await fetch("http://localhost:3000/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (data.success) {
            alert("Cadastro realizado com sucesso!");
            localStorage.setItem("usuario_id", data.usuario_id); // 💾 Salva o ID localmente
            window.location.href = "home.html";

        } else {
            alert("Erro ao cadastrar. Tente novamente.");
        }
    } catch (error) {
        alert("Erro ao conectar-se ao servidor!");
    }
});