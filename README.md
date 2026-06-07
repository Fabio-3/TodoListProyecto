# TodoList + Mini Drive con Autenticación JWT y HTTPS

Proyecto desarrollado con React, Express, MongoDB Atlas, Passport Local Strategy, Passport JWT y HTTPS.

## Requisitos

* Node.js
* MongoDB Atlas
* Git
* OpenSSL

## Clonar repositorio

```bash
git clone https://github.com/Fabio-3/TodoListProyecto.git
```
## Configuración del Backend

Entrar a la carpeta backend:

```bash
cd TodoListProyecto
cd backend
```
Instalar dependencias:

```bash
npm install
```
Crear un archivo `.env` tomando como referencia `.env.example`.
El archivo .env.example se encuentra dentro de la carpeta backend.

Ejemplo:

```env
MONGODB_URI=URI_DE_MONGODB
JWT_SECRET=SECRETO
APP_USER=USUARIO
APP_PASSWORD=PASSWORD
```
Generar certificados HTTPS:

```bash
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
```
Los archivos `key.pem` y `cert.pem` deben quedar dentro de la carpeta backend.

Iniciar servidor:

```bash
node server.js
```
Servidor HTTPS:
https://localhost:3000

- Al utilizar certificados autofirmados el navegador puede mostrar una advertencia de seguridad. Seleccionar "Configuración avanzada" y luego "Continuar a localhost".

## Configuración del Frontend

Abrir una nueva terminal.

Entrar a la carpeta del frontend:

```bash
cd ..
cd react-frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar aplicación:

```bash
npm run dev
```

Frontend disponible en:
http://localhost:5173


## Credenciales de prueba

Configurar en el archivo `.env`:

```env
APP_USER=admin
APP_PASSWORD=12345
```
## Base de datos de prueba

La carpeta:

database/tasks.json

Contiene registros de ejemplo para la colección de tareas y puede utilizarse para realizar pruebas de la aplicación.

## Funcionalidades

* Login mediante Passport Local Strategy.
* Autenticación mediante JWT.
* Protección de endpoints mediante Passport JWT.
* CRUD completo de tareas.
* CRUD completo de archivos.
* Subida de archivos mediante Multer.
* Descarga de archivos protegida.
* Almacenamiento de tareas en MongoDB Atlas.
* Almacenamiento de archivos en carpeta uploads.
* HTTPS mediante certificados autofirmados.
* Manejo de expiración de token.
* Cierre de sesión.



