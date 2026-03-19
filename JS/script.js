// Variables globales
let prioridadSeleccionada = "baja";
let notaAEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarNotas();

  const tituloInput = document.getElementById("titulo");
  const contenidoInput = document.getElementById("contenido");

  // Guardar con Enter
  function manejarEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarNota();
    }
  }

  tituloInput.addEventListener("keydown", manejarEnter);
  contenidoInput.addEventListener("keydown", manejarEnter);

  // Barra de prioridad
  document.querySelectorAll(".opcion").forEach(op => {
    op.addEventListener("click", () => {
      document.querySelectorAll(".opcion").forEach(o => o.classList.remove("activa"));
      op.classList.add("activa");
      prioridadSeleccionada = op.dataset.value;
    });
  });

  // Modal botones
  document.getElementById("cancelar").addEventListener("click", cerrarModal);

  document.getElementById("confirmar").addEventListener("click", () => {
    if (notaAEliminar !== null) {
      const notas = obtenerNotas();

      // eliminar correctamente por ID
      const nuevasNotas = notas.filter(n => n.id !== notaAEliminar);

      guardarNotas(nuevasNotas);
      cargarNotas();
    }
    cerrarModal();
  });
});

// Obtener notas
function obtenerNotas() {
  return JSON.parse(localStorage.getItem("notas")) || [];
}

// Guardar notas
function guardarNotas(notas) {
  localStorage.setItem("notas", JSON.stringify(notas));
}

// Agregar nota
function agregarNota() {
  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("contenido").value.trim();

  if (titulo === "" || contenido === "") {
    alert("Por favor llena ambos campos");
    return;
  }

  const notas = obtenerNotas();

  notas.push({
    id: Date.now(), // ID único
    titulo,
    contenido,
    prioridad: prioridadSeleccionada
  });

  guardarNotas(notas);
  cargarNotas();

  document.getElementById("titulo").value = "";
  document.getElementById("contenido").value = "";
}

// Cargar notas (ordenadas)
function cargarNotas() {
  const contenedor = document.getElementById("contenedorNotas");
  contenedor.innerHTML = "";

  const notas = obtenerNotas();

  const orden = {
    alta: 1,
    media: 2,
    baja: 3
  };

  notas.sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);

  notas.forEach(nota => {
    crearNota(nota);
  });
}

// Crear nota
function crearNota(nota) {
  const contenedor = document.getElementById("contenedorNotas");

  const iconos = {
    alta: "❤️",
    media: "⭐",
    baja: "🌿"
  };

  const div = document.createElement("section");
  div.className = `nota ${nota.prioridad || "baja"}`;

  div.innerHTML = `
    <button class="eliminar">✖</button>
    <button class="editar">✎</button>

    <div class="contenido-nota">
      <h2>${iconos[nota.prioridad] || "🌿"} ${nota.titulo}</h2>
      <p>${nota.contenido}</p>
      <span class="prioridad">${(nota.prioridad || "baja").toUpperCase()}</span>
    </div>
  `;

  // eliminar
  div.querySelector(".eliminar").addEventListener("click", () => {
    mostrarModal(nota.id);
  });

  // editar inline
  div.querySelector(".editar").addEventListener("click", () => {
    activarEdicion(div, nota);
  });

  contenedor.appendChild(div);
}

// Activar edición en la misma nota
function activarEdicion(div, nota) {
  div.innerHTML = `
    <input class="edit-titulo" value="${nota.titulo}">
    <textarea class="edit-contenido">${nota.contenido}</textarea>

    <div class="acciones-edit">
      <button class="guardar">Guardar 💕</button>
      <button class="cancelar-edit">Cancelar</button>
    </div>
  `;

  // guardar cambios
  div.querySelector(".guardar").addEventListener("click", () => {
    const nuevoTitulo = div.querySelector(".edit-titulo").value.trim();
    const nuevoContenido = div.querySelector(".edit-contenido").value.trim();

    if (nuevoTitulo === "" || nuevoContenido === "") {
      alert("No puede estar vacío");
      return;
    }

    const notas = obtenerNotas();

    const nuevasNotas = notas.map(n => {
      if (n.id === nota.id) {
        return {
          ...n,
          titulo: nuevoTitulo,
          contenido: nuevoContenido
        };
      }
      return n;
    });

    guardarNotas(nuevasNotas);
    cargarNotas();
  });

  // cancelar edición
  div.querySelector(".cancelar-edit").addEventListener("click", () => {
    cargarNotas();
  });
}

// Mostrar modal
function mostrarModal(id) {
  notaAEliminar = id;
  document.getElementById("modalEliminar").classList.remove("oculto");
}

// Cerrar modal
function cerrarModal() {
  document.getElementById("modalEliminar").classList.add("oculto");
  notaAEliminar = null;
}