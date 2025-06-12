document.addEventListener("DOMContentLoaded", async () => {
    // Função genérica para requisições HTTP
    const handleRequest = async (url, method, body = null) => {
        try {
            const options = { method, headers: { "Content-Type": "application/json" } };
            if (body) options.body = JSON.stringify(body);

            const response = await fetch(url, options);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            return data;
        } catch (error) {
            alert("Erro: " + error.message);
            console.error(error);
        }
    };

    // Verifica ID do usuário
    const usuarioId = localStorage.getItem("usuario_id");
    console.log("ID do usuário:", usuarioId);

    if (!usuarioId) {
        alert("Erro: Faça login antes de acessar seus flashcards.");
        window.location.href = "login.html";
        return;
    }

    // Configuração do botão Perfil e modal
    const perfilBtn = document.querySelector(".perfil");
    const modalPerfil = document.getElementById("modal-perfil");

    perfilBtn.addEventListener("click", () => {
        modalPerfil.style.display = modalPerfil.style.display === "block" ? "none" : "block";
    });

    window.fecharPerfil = () => {
        modalPerfil.style.display = "none";
    };

    window.logout = () => {
        alert("Você saiu da conta!");
        localStorage.removeItem("usuario_id");
        window.location.href = "login.html"; // Redireciona para a tela de login
    };

    // Listar flashcards do usuário
    try {
        const resposta = await handleRequest(`/flashcards/${usuarioId}`, "GET");
        if (resposta && resposta.flashcards.length) {
            const lista = document.getElementById("flashcards-list");
            resposta.flashcards.forEach(flashcard => {
                const card = document.createElement("div");
                card.classList.add("flashcard");
                card.innerHTML = `
                    <h3>${flashcard.titulo}</h3>
                    <p>${flashcard.pergunta}</p>
                    <p class="resposta" style="display: none;"><strong>Resposta:</strong> ${flashcard.resposta}</p>
                    <button class="mostrar-resposta" onclick="mostrarResposta(this)">Mostrar Resposta</button>
                    <div class="btn-group">
                        <button class="editar-btn" onclick="editarFlashcard(${flashcard.id})">
                            <img src="img/lapis.png" alt="Editar" width="20">
                        </button>
                        <button class="excluir-btn" onclick="removerFlashcard(${flashcard.id})">
                            <img src="img/lixo.png" alt="Excluir" width="20">
                        </button>
                    </div>
                `;
                lista.appendChild(card);
            });
        } else {
            alert("Nenhum flashcard encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar flashcards:", error);
        alert("Erro ao carregar seus flashcards. Verifique sua conexão com o servidor.");
    }

    // Criar flashcard
    document.querySelector("#form-flashcard").addEventListener("submit", async (event) => {
        event.preventDefault();

        const titulo = document.querySelector("#titulo").value;
        const pergunta = document.querySelector("#pergunta").value;
        const resposta = document.querySelector("#resposta").value;

        if (await handleRequest("/criar-flashcard", "POST", { titulo, pergunta, resposta, usuario_id: usuarioId })) {
            window.location.reload();
        }
    });
    // barra de pesquisa
document.getElementById("search-button").addEventListener("click", () => {
    const termoPesquisa = document.getElementById("search-bar").value.toLowerCase();
    const flashcards = document.querySelectorAll(".flashcard");
    let encontrouFlashcard = false;

    flashcards.forEach(card => {
        const titulo = card.querySelector("h3").innerText.toLowerCase();
        const pergunta = card.querySelector("p").innerText.toLowerCase();

        if (titulo.includes(termoPesquisa) || pergunta.includes(termoPesquisa)) {
            card.style.display = "block";
            encontrouFlashcard = true;
        } else {
            card.style.display = "none";
        }
    });

    const mensagemErro = document.getElementById("mensagem-erro");

    if (!encontrouFlashcard) {
        mensagemErro.style.display = "block";
    } else {
        mensagemErro.style.display = "none";
    }
});

    // Mostrar resposta do flashcard
    window.mostrarResposta = (button) => {
        const resposta = button.previousElementSibling;
        resposta.style.display = resposta.style.display === "block" ? "none" : "block";
        button.innerText = resposta.style.display === "block" ? "Ocultar Resposta" : "Mostrar Resposta";
    };

    // Atualizar flashcard
    window.editarFlashcard = async (id) => {
        const titulo = prompt("Novo título:");
        const pergunta = prompt("Nova pergunta:");
        const resposta = prompt("Nova resposta:");

        if (titulo && pergunta && resposta) {
            await handleRequest(`/editar-flashcard/${id}`, "PUT", { titulo, pergunta, resposta });
            window.location.reload();
        }
    };

    // Remover flashcard
    window.removerFlashcard = async (id) => {
        if (confirm("Tem certeza que deseja excluir este flashcard?")) {
            await handleRequest(`/deletar-flashcard/${id}`, "DELETE");
            window.location.reload();
        }
    };
});
document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) return;

    try {
        const resposta = await fetch(`/verificar-admin/${usuarioId}`);
        const data = await resposta.json();

        if (data.success && data.isAdmin) {
            document.getElementById("admin-button").style.display = "block"; // Exibe o botão dentro do modal
        }
    } catch (error) {
        console.error("Erro ao verificar admin:", error);
    }
});
