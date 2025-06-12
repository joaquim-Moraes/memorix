document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o ID do usuário
    const usuarioId = localStorage.getItem("usuario_id");

    if (!usuarioId) {
        alert("Erro: Faça login antes de acessar esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        // Verifica se o usuário é admin
        const respostaAdmin = await fetch(`/verificar-admin/${usuarioId}`);
        const dataAdmin = await respostaAdmin.json();

        if (!dataAdmin.success || !dataAdmin.isAdmin) {
            alert("Você não tem permissão para acessar esta página.");
            window.location.href = "home.html"; // Redireciona o usuário para a home
            return;
        }
    } catch (error) {
        console.error("Erro ao verificar admin:", error);
        alert("Erro ao verificar permissões.");
        window.location.href = "home.html";
        return;
    }

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

    // Listar usuários
    try {
        const resposta = await handleRequest("/usuarios", "GET");
        if (resposta && resposta.usuarios.length) {
            const lista = document.getElementById("usuarios-list");

            resposta.usuarios.forEach(usuario => {
                const item = document.createElement("div");
                item.classList.add("usuario");
                item.innerHTML = `
                    <p><strong>Nome:</strong> ${usuario.nome}</p>
                    <p><strong>Email:</strong> ${usuario.email}</p>
                    <button class="excluir-usuario" onclick="removerUsuario(${usuario.id})">
                        <img src="img/lixo.png" alt="Excluir" width="20">
                    </button>
                `;
                lista.appendChild(item);
            });
        } else {
            alert("Nenhum usuário encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        alert("Erro ao carregar lista de usuários. Verifique sua conexão com o servidor.");
    }

    // Remover usuário
window.removerUsuario = async (id, emailAlvo) => {
    const usuarioId = localStorage.getItem("usuario_id");
    if (!usuarioId) {
        alert("Erro: usuário não autenticado.");
        return;
    }

    // Solicita o e-mail para confirmar a identidade
    const emailDigitado = prompt("Confirme seu e-mail de administrador para prosseguir:");

    try {
        const resposta = await fetch(`/verificar-admin/${usuarioId}`);
        const data = await resposta.json();

        if (!data.success || !data.isAdminEmail || data.adminEmail !== emailDigitado) {
            alert("Erro: você não tem permissão para excluir usuários ou e-mail incorreto.");
            return;
        }

        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            await handleRequest(`/deletar-usuario/${id}`, "DELETE");
            window.location.reload();
        }
    } catch (erro) {
        console.error("Erro na verificação:", erro);
        alert("Erro ao verificar permissões.");
    }
};
});