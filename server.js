  const express = require("express"); // Framework para criar servidor e rotas
const mysql = require("mysql2"); // Biblioteca para conectar no MySQL
const path = require("path"); // Módulo nativo do Node para lidar com caminhos

const app = express(); // Cria a aplicação Express

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos (HTML, CSS, JS da pasta public/)
app.use(express.static(path.join(__dirname, "public")));

// Conexão com o banco MySQL (via XAMPP)
const db = mysql.createConnection({
  host: "localhost", // Servidor do MySQL
  user: "root", // Usuário padrão do XAMPP
  password: "", // Senha (geralmente vazia no XAMPP)
  database: "Decepticons", // Nome do banco que você criou
});

app.get("/soldados", (req, res) => {
  db.query("SELECT * FROM soldados", (err, results) => {
    if (err) throw err; // Se der erro na query, interrompe
    res.json(results); // Envia o resultado como JSON para o front
  });
});

// POST /usuarios → insere um novo usuário no banco
app.post("/soldados", (req, res) => {
  const { nome, modo_alternativo } = req.body; // Extrai os dados enviados pelo front
  db.query(
    "INSERT INTO soldados (nome, modo_alternativo) VALUES (?, ?)", // Query SQL com placeholders
    [nome, modo_alternativo], // Valores que substituem os "?"
    (err, result) => {
      if (err) throw err;
      res.json({ message: "Soldado adicionado com sucesso!" }); // Retorno de sucesso
    }
  );
});


app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);