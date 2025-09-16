window.onload = function() {
  const notasGuardadas = JSON.parse(localStorage.getItem("notas")) || [];
  notasGuardadas.forEach(nota => crearNota(nota.titulo, nota.contenido));
};

function agregarNota() {
  const titulo = document.getElementById("titulo").value;
  const contenido = document.getElementById("contenido").value;

  if (titulo.trim() === "" || contenido.trim() === "") {
    alert("Por favor llena ambos campos");
    return;
  }

  crearNota(titulo, contenido);
  guardarNotas();

  document.getElementById("titulo").value = "";
  document.getElementById("contenido").value = "";
}

function crearNota(titulo, contenido) {
  const nota = document.createElement("section");
  nota.className = "nota";
  nota.innerHTML = `
    <button class="eliminar">✖</button>
    <h2>${titulo}</h2>
    <p>${contenido}</p>
  `;

  nota.querySelector(".eliminar").addEventListener("click", function() {
    nota.remove();
    guardarNotas();
  });

  document.getElementById("contenedorNotas").appendChild(nota);
}

function guardarNotas() {
  const notas = [];
  document.querySelectorAll(".nota").forEach(nota => {
    const titulo = nota.querySelector("h2").innerText;
    const contenido = nota.querySelector("p").innerText;
    notas.push({ titulo, contenido });
  });
  localStorage.setItem("notas", JSON.stringify(notas));
}

