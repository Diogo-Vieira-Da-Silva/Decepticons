const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Decepticons",
});

// GET all soldados
app.get("/soldados", (req, res) => {
  db.query("SELECT * FROM soldados", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET soldado by id
app.get("/soldados/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM soldados WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: "Soldado não encontrado" });
    res.json(results[0]);
  });
});

// POST new soldado
app.post("/soldados", (req, res) => {
  const { nome, modo_alternativo } = req.body;
  db.query(
    "INSERT INTO soldados (nome, modo_alternativo) VALUES (?, ?)",
    [nome, modo_alternativo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Soldado adicionado com sucesso!", id: result.insertId });
    }
  );
});

// GET all medicos
app.get("/medicos", (req, res) => {
  db.query("SELECT * FROM medicos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET medico by id
app.get("/medicos/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM medicos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results || results.length === 0) return res.status(404).json({ error: "Médico não encontrado" });
    res.json(results[0]);
  });
});

// POST new medico
app.post("/medicos", (req, res) => {
  const { nome, modo_alternativo } = req.body;
  db.query(
    "INSERT INTO medicos (nome, modo_alternativo) VALUES (?, ?)",
    [nome, modo_alternativo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Médico adicionado com sucesso!", id: result.insertId });
    }
  );
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));