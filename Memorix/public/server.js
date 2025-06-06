require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Função centralizada para lidar com erros
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ success: false, message });
};

// 📌 Rota de Cadastro
app.post("/cadastrar", async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    try {
        const result = await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id",
            [nome, email, senhaHash]
        );

        res.json({ success: true, message: "Cadastro realizado!", usuario_id: result.rows[0].id });
    } catch (error) {
        handleError(res, error, "Erro ao cadastrar usuário.");
    }
});

// 🔑 Login do usuário (retorna ID corretamente)
app.post("/logar", async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (result.rows.length === 0) return res.status(401).json({ success: false, message: "Usuário não encontrado" });

        const usuario = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (senhaValida) {
            res.json({ success: true, message: "Login realizado!", usuario_id: usuario.id });
        } else {
            res.status(401).json({ success: false, message: "Senha incorreta" });
        }
    } catch (error) {
        handleError(res, error, "Erro ao realizar login.");
    }
});

// 📄 Listar flashcards do usuário logado
app.get("/flashcards/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM flashcards WHERE usuario_id = $1", [usuario_id]);
        res.json({ success: true, flashcards: result.rows });
    } catch (error) {
        handleError(res, error, "Erro ao buscar flashcards.");
    }
});

// ✏️ Criar flashcard
app.post("/criar-flashcard", async (req, res) => {
    const { titulo, pergunta, resposta, usuario_id } = req.body;
    if (!usuario_id) return res.status(400).json({ success: false, message: "ID do usuário é obrigatório." });

    try {
        await pool.query(
            "INSERT INTO flashcards (titulo, pergunta, resposta, usuario_id) VALUES ($1, $2, $3, $4)",
            [titulo, pergunta, resposta, usuario_id]
        );
        res.json({ success: true, message: "Flashcard criado!" });
    } catch (error) {
        handleError(res, error, "Erro ao criar flashcard.");
    }
});

// ✏️ Atualizar flashcard
app.put("/editar-flashcard/:id", async (req, res) => {
    const { titulo, pergunta, resposta } = req.body;

    try {
        await pool.query(
            "UPDATE flashcards SET titulo = $1, pergunta = $2, resposta = $3 WHERE id = $4",
            [titulo, pergunta, resposta, req.params.id]
        );
        res.json({ success: true, message: "Flashcard atualizado!" });
    } catch (error) {
        handleError(res, error, "Erro ao atualizar flashcard.");
    }
});

// ❌ Remover flashcard
app.delete("/deletar-flashcard/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM flashcards WHERE id = $1", [req.params.id]);
        res.json({ success: true, message: "Flashcard excluído!" });
    } catch (error) {
        handleError(res, error, "Erro ao deletar flashcard.");
    }
});

// 📂 Servir páginas
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "cadastro.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));

// 🔥 Iniciar servidor
app.listen(port, () => console.log(`🚀 Servidor rodando em http://localhost:${port}`));