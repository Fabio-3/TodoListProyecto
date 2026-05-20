const descripcion = document.getElementById("descripcion");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");

document.addEventListener("DOMContentLoaded", mostrarTareas);

boton.addEventListener("click", function (e) {
    e.preventDefault();
    agregarTarea();
});

function obtenerFechaHoy() {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
}

async function agregarTarea() {
    if (descripcion.value === "") return;
    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            texto: descripcion.value

        })
    });
    descripcion.value = "";
    mostrarTareas();
}

async function mostrarTareas() {
    lista.innerHTML = "";
    const response = await fetch('http://localhost:3000/tasks');
    const tareas = await response.json();
    tareas.forEach((tarea) => {

        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completado;
        checkbox.classList.add("checkbox");

        const texto = document.createElement("input");
        texto.type = "text";
        texto.value = tarea.texto;
        texto.classList.add("texto");

        const fechaTexto = document.createElement("span");
        fechaTexto.textContent = tarea.fecha;
        fechaTexto.classList.add("fecha");

        const actualizar = document.createElement("button");
        actualizar.textContent = "Actualizar";
        actualizar.classList.add("btn-actualizar");
        actualizar.addEventListener("click", async function () {
            await fetch(`http://localhost:3000/tasks/${tarea._id}`, {
                method: 'PUT',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                   texto: texto.value
                })
            });
            mostrarTareas();
        });

        const eliminar = document.createElement("button");
        eliminar.textContent = "Eliminar";
        eliminar.classList.add("btn-eliminar");
        eliminar.addEventListener("click", async function () {
            await fetch(`http://localhost:3000/tasks/${tarea._id}`, {
               method: 'DELETE'
            });
            mostrarTareas();
        });

        li.appendChild(checkbox);
        li.appendChild(texto);
        li.appendChild(fechaTexto);
        li.appendChild(actualizar);
        li.appendChild(eliminar);
        lista.appendChild(li);
    });
}