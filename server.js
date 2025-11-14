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

// ================== GET SOLDADOS ==================
app.get("/soldados", (req, res) => {
  db.query("SELECT * FROM soldados", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================== GET SOLDADO BY ID ==================
app.get("/soldados/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM soldados WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Soldado não encontrado" });
    res.json(results[0]);
  });
});

// ================== POST SOLDADO ==================
app.post("/soldados", (req, res) => {
  const { nome, modo_alternativo } = req.body;
  db.query(
    "INSERT INTO soldados (nome, modo_alternativo) VALUES (?, ?)",
    [nome, modo_alternativo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Soldado adicionado!", id: result.insertId });
    }
  );
});

// ================== DELETE SOLDADO POR NOME ==================
app.delete("/soldados/:nome", (req, res) => {
  const nome = req.params.nome.toLowerCase();

  db.query("DELETE FROM soldados WHERE LOWER(nome) = ?", [nome], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Nenhum soldado com esse nome encontrado" });

    res.json({ message: "Soldado deletado com sucesso!" });
  });
});

// ================== GET MEDICOS ==================
app.get("/medicos", (req, res) => {
  db.query("SELECT * FROM medicos", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ================== GET MEDICO BY ID ==================
app.get("/medicos/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM medicos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Médico não encontrado" });
    res.json(results[0]);
  });
});

// ================== POST MEDICOS ==================
app.post("/medicos", (req, res) => {
  const { nome, modo_alternativo } = req.body;
  db.query(
    "INSERT INTO medicos (nome, modo_alternativo) VALUES (?, ?)",
    [nome, modo_alternativo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Médico adicionado!", id: result.insertId });
    }
  );
});

// ================== DELETE MEDICO POR NOME ==================
app.delete("/medicos/:nome", (req, res) => {
  const nome = req.params.nome.toLowerCase();

  db.query("DELETE FROM medicos WHERE LOWER(nome) = ?", [nome], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Nenhum médico com esse nome encontrado" });

    res.json({ message: "Médico deletado com sucesso!" });
  });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));

