import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [tareas, setTareas] = useState([])
  const [texto, setTexto] = useState("")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {

    obtenerTareas()

  }, [])

  async function obtenerTareas() {

    const response = await fetch('http://localhost:3000/tasks')

    const data = await response.json()

    setTareas(data.data)

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

    </div>
  )
}

export default App