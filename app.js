async function loadProjects() {
  const res = await fetch("/api/projects");
  const projects = await res.json();
  const list = document.getElementById("projectList");
  list.innerHTML = "";
  projects.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${p.name}</b> [${p.cloud}] - <a href="${p.url}" target="_blank">Открыть</a>
      <button onclick="deleteProject(${p.id})">Удалить</button>`;
    list.appendChild(li);
  });
}

async function addProject(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const url = document.getElementById("url").value;
  const cloud = document.getElementById("cloud").value;

  await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, url, cloud })
  });

  document.getElementById("projectForm").reset();
  loadProjects();
}

async function deleteProject(id) {
  await fetch("/api/projects/" + id, { method: "DELETE" });
  loadProjects();
}

document.getElementById("projectForm").addEventListener("submit", addProject);
loadProjects();
