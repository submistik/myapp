const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");

console.log("📂 Проверяем содержимое папки:", publicDir);

fs.readdir(publicDir, (err, files) => {
  if (err) {
    return console.error("❌ Ошибка:", err.message);
  }
  console.log("✅ Найденные файлы:");
  files.forEach(file => console.log(" -", file));
});
