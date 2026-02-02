const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const FILE = "./data.json";

// cria arquivo se não existir
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

// rota teste
app.get("/", (req, res) => {
  res.json({ status: "API Empréstimo Operador ONLINE 🚀" });
});

// salvar envio
app.post("/enviar", (req, res) => {
  const { operador, numero, mensagem } = req.body;

  if (!numero || !mensagem) {
    return res.status(400).json({ erro: "Número e mensagem obrigatórios" });
  }

  const dados = JSON.parse(fs.readFileSync(FILE));
  dados.push({
    operador: operador || "não informado",
    numero,
    mensagem,
    data: new Date().toLocaleString("pt-BR")
  });

  fs.writeFileSync(FILE, JSON.stringify(dados, null, 2));
  res.json({ sucesso: true });
});

// histórico
app.get("/historico", (req, res) => {
  const dados = JSON.parse(fs.readFileSync(FILE));
  res.json(dados.reverse());
});

// contador
app.get("/contador", (req, res) => {
  const dados = JSON.parse(fs.readFileSync(FILE));
  res.json({ total: dados.length });
});

app.listen(PORT, () => {
  console.log("🔥 API rodando");
});
