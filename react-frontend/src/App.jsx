import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [tareas, setTareas] = useState([])
  const [texto, setTexto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [archivos, setArchivos] = useState([])
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)

  useEffect(() => {
    obtenerTareas()
    obtenerArchivos()
  }, [])

  async function obtenerTareas() {
    const response = await fetch('http://localhost:3000/tasks')
    const data = await response.json()
    setTareas(data.data)
  }

  async function obtenerArchivos() {
    const response =
      await fetch('http://localhost:3000/files')
    const data = await response.json()
    setArchivos(data.data)
  }

  async function agregarTarea() {
    if (texto.trim() === "") {
      setMensaje("La tarea está vacía")
      return
    }
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texto
      })
    })
    if (response.status === 201) {
      setTexto("")
      setMensaje("")
      obtenerTareas()
    }
  }

  async function eliminarTarea(id) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      const nuevasTareas = tareas.filter((tarea) => {
        return tarea._id !== id
      })
      setTareas(nuevasTareas)
    }
  }

  async function actualizarTarea(id, nuevoTexto) {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texto: nuevoTexto
      })
    })
    if (response.status === 200) {
      const nuevasTareas = tareas.map((tarea) => {
        if (tarea._id === id) {
          return {
            ...tarea,
            texto: nuevoTexto
          }
        }
        return tarea
      })
      setTareas(nuevasTareas)
    }
  }

  async function subirArchivo() {
    if (!archivoSeleccionado) {
      return
    }
    const formData = new FormData()
    formData.append(
      'archivo',
      archivoSeleccionado
    )
    const response =
      await fetch(
        'http://localhost:3000/files',
        {
         method: 'POST',
         body: formData
        }
      )
      if (response.status === 201) {
        obtenerArchivos()
        setArchivoSeleccionado(null)
      }
  }

  function descargarArchivo(nombre) {
    window.open(
      `http://localhost:3000/files/download/${nombre}`
    )
  }

  async function eliminarArchivo(nombre) {
    const response =
      await fetch(
        `http://localhost:3000/files/${nombre}`,
        {
          method: 'DELETE'
        }
      )
    if (response.status === 200) {
      obtenerArchivos()
    }
  }

  return (
    <div className="container">
      <div className="form-section">
        <h2>Nuevo</h2>
        <input
          type="text"
          placeholder="Descripción"
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setMensaje("")
          }}
        />
        <button onClick={agregarTarea}>
          Agregar
        </button>
        <p>{mensaje}</p>
      </div>
      <div className="list-section">
        <h2>Todo List</h2>
        <ul>
          {tareas.map((tarea) => (
            <li key={tarea._id}>
              <input
                type="checkbox"
                className="checkbox"
              />
              <input
                type="text"
                className="texto"
                value={tarea.texto}
                onChange={(e) => {
                  const nuevasTareas = tareas.map((t) => {
                    if (t._id === tarea._id) {
                      return {
                        ...t,
                        texto: e.target.value
                      }
                    }
                    return t
                  })
                  setTareas(nuevasTareas)
                }}
              />
              <span className="fecha">
                {tarea.fecha}
              </span>
              <button
                className="btn-actualizar"
                onClick={(e) => {
                 const nuevoTexto =
                  e.target.parentElement
                    .querySelector('.texto').value
                 actualizarTarea(
                    tarea._id,
                    nuevoTexto
                  )
                }}
              >
                Actualizar
              </button>
              <button
                className="btn-eliminar"
                onClick={() =>
                  eliminarTarea(tarea._id)
                }
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="drive-section">
        <h2>Mini Drive</h2>
        <input
          type="file"
          onChange={(e) => {
            setArchivoSeleccionado(
              e.target.files[0]
            )
          }}
        />
        <button onClick={subirArchivo}>
          Subir Archivo
        </button>
        <ul>
          {archivos.map((archivo) => (
            <li key={archivo.nombre}>
              <span className="texto">
                {archivo.nombre}
              </span>
              <span className="fecha">
                {archivo.tamaño}
              </span>
              <span className="fecha">
                {archivo.fecha}
              </span>
              <button
                className="btn-actualizar"
                onClick={() =>
                  descargarArchivo(archivo.nombre)
                }
              >  
                Descargar
              </button>
              <button
                className="btn-eliminar"
                onClick={() =>
                  eliminarArchivo(archivo.nombre)
                }
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default App