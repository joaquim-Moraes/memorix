document.addEventListener("DOMContentLoaded", async () => {
    const usuarioId = localStorage.getItem("usuario_id");

    if (!usuarioId) {
        alert("Erro: Faça login antes de acessar seus flashcards.");
        window.location.href = "login.html";
        return;
    }

    const resposta = await fetch(`/flashcards/${usuarioId}`);
    const data = await resposta.json();

    if (data.success) {
        const lista = document.querySelector("#flashcards-list");

        data.flashcards.forEach(flashcard => {
            const card = document.createElement("div");
            card.classList.add("flashcard");
            card.innerHTML = `<h3>${flashcard.titulo}</h3><p>${flashcard.pergunta}</p>`;
            card.addEventListener("click", () => abrirModal(flashcard));
            lista.appendChild(card);
        });
    } else {
        alert("Nenhum flashcard encontrado.");
    }
});
document.querySelector(".perfil").addEventListener("click", () => {
    const modalPerfil = document.getElementById("modal-perfil");

    if (modalPerfil.style.display === "block") {
        modalPerfil.style.display = "none"; // Fecha o modal se já estiver aberto
    } else {
        modalPerfil.style.display = "block"; // Exibe o modal
    }
});

    window.fecharPerfil = () => {
    document.getElementById("modal-perfil").style.display = "none";
    };

    window.logout = () => {
    alert("Você saiu da conta!");
    window.location.href = "login.html"; // Redireciona para a tela de login
    };
// Função para exibir flashcard no modal
window.abrirModal = (flashcard) => {
    document.querySelector("#modal-titulo").innerText = flashcard.titulo;
    document.querySelector("#modal-pergunta").innerText = flashcard.pergunta;
    document.querySelector("#modal-resposta").innerText = flashcard.resposta;

    // Esconde a resposta por padrão ao abrir o modal
    document.querySelector("#modal-resposta").style.display = "none";

    document.querySelector("#flashcard-modal").style.display = "block";
};

// Função para exibir a resposta do flashcard no modal **apenas quando clicar**
window.mostrarResposta = () => {
    const resposta = document.querySelector("#modal-resposta");
    const botao = document.querySelector("#botao-resposta");

    if (resposta.style.display === "none") {
        resposta.style.display = "block";
        botao.innerText = "Ocultar Resposta"; // Troca para "Ocultar"
    } else {
        resposta.style.display = "none";
        botao.innerText = "Mostrar Resposta"; // Volta para "Mostrar"
    }
};

// Função para fechar o modal e esconder a resposta novamente
window.fecharModal = () => {
    document.querySelector("#flashcard-modal").style.display = "none";
    document.querySelector("#modal-resposta").style.display = "none"; // Esconde a resposta ao fechar
};