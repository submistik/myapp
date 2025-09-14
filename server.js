const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Подключаем БД (файл projects.db создаётся автоматически)
const db = new sqlite3.Database("./projects.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      url TEXT,
      cloud TEXT
    )
  `);
});

app.use(bodyParser.json());

// Отдаём статические файлы из папки "public"
app.use(express.static(path.join(__dirname, "public")));

// Корневой маршрут → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Получить все проекты
app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Добавить проект
app.post("/api/projects", (req, res) => {
  const { name, url, cloud } = req.body;
  db.run(
    "INSERT INTO projects (name, url, cloud) VALUES (?, ?, ?)",
    [name, url, cloud],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, url, cloud });
    }
  );
});

// Удалить проект
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM projects WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
  console.log("📂 Открой в браузере: http://localhost:3000");
});
