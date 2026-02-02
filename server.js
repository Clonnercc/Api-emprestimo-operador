const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Banco de dados persistente
const db = new sqlite3.Database("./db.sqlite");

// Criar tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS envios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT,
      mensagem TEXT,
      operador TEXT,
      data DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rota principal (teste Render)
app.get("/", (req, res) => {
  res.json({ status: "API LR Empréstimo ONLINE 🚀" });
});

// Salvar envio
app.post("/enviar", (req, res) => {
  const { numero, mensagem, operador } = req.body;

  if (!numero || !mensagem) {
    return res.status(400).json({ erro: "Número e mensagem são obrigatórios" });
  }

  db.run(
    `INSERT INTO envios (numero, mensagem, operador) VALUES (?, ?, ?)`,
    [numero, mensagem, operador || "não informado"],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

// Listar histórico
app.get("/historico", (req, res) => {
  db.all(`SELECT * FROM envios ORDER BY data DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json(rows);
  });
});

// Contador
app.get("/contador", (req, res) => {
  db.get(`SELECT COUNT(*) as total FROM envios`, [], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ total: row.total });
  });
});

app.listen(PORT, () => {
  console.log(`🔥 API rodando na porta ${PORT}`);
});
