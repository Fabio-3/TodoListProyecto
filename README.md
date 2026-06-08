# TodoList + Mini Drive con Autenticación JWT y HTTPS

Proyecto desarrollado con React, Express, MongoDB Atlas, Passport Local Strategy, Passport JWT y HTTPS.

## Requisitos Previos

Antes de ejecutar el proyecto es necesario tener instalado:

* Node.js
* Git
* MongoDB Atlas
* OpenSSL

---

## Clonar Repositorio

```bash
git clone https://github.com/Fabio-3/TodoListProyecto.git
```

Entrar al proyecto:

```bash
cd TodoListProyecto
```

---

## Configuración de MongoDB Atlas

### 1. Crear una cuenta

Ingresar a:

https://www.mongodb.com/cloud/atlas

Crear una cuenta o iniciar sesión.

### 2. Crear un Cluster

Seleccionar:

Create → Cluster

Mantener la configuración gratuita (Free Tier) y finalizar la creación.

### 3. Crear la Base de Datos

Ingresar al Cluster y seleccionar:

Browse Collections

Crear una base de datos llamada:

```text
todolist
```

Crear una colección llamada:

```text
tasks
```

### 4. Obtener la URI de Conexión

Seleccionar:

Connect → Drivers

Copiar la cadena de conexión proporcionada por MongoDB Atlas.

Ejemplo:

```text
mongodb+srv://usuario:<password>@cluster.mongodb.net/todolist
```

Reemplazar:

* usuario → nombre de usuario configurado en Atlas.
* password → contraseña configurada en Atlas.

Si la conexión SRV presenta problemas, puede utilizarse la cadena de conexión estándar proporcionada por MongoDB Atlas(sin SRV).

---

## Configuración del Backend

Entrar a la carpeta backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

### Configurar archivo .env

Dentro de la carpeta backend existe un archivo:

```text
.env.example
```

Crear un nuevo archivo llamado:

```text
.env
```

Tomando como referencia el contenido de `.env.example`.

Ejemplo:

```env
MONGODB_URI=URI_DE_MONGODB
JWT_SECRET=SECRETO
APP_USER=USUARIO
APP_PASSWORD=PASSWORD
```

Ejemplo de uso:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/todolist
JWT_SECRET=secreto123
APP_USER=admin
APP_PASSWORD=12345
```

---

## Instalación de OpenSSL y Generación de Certificados HTTPS

### 1. Instalar OpenSSL

Descargar la versión Win64 completa desde:

https://slproweb.com/products/Win32OpenSSL.html

Durante la instalación mantener las opciones por defecto.

### 2. Agregar OpenSSL al PATH

Agregar la carpeta bin de OpenSSL a las Variables de Entorno de Windows.

Verificar la instalación ejecutando:

```bash
openssl version
```

Debe mostrarse la versión instalada.

### 3. Generar Certificados

Dentro de la carpeta backend ejecutar:

```bash
openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
```

Cuando se solicite:

```text
Common Name
```

ingresar:

```text
localhost
```

### 4. Resultado Esperado

Se crearán los archivos:

```text
key.pem
cert.pem
```

dentro de la carpeta backend.

Estos archivos no se incluyen en el repositorio y deben generarse localmente en el equipo por motivos de seguridad.

### 5. Advertencia del Navegador

Al utilizar certificados autofirmados el navegador puede mostrar una advertencia de seguridad.

Seleccionar:

```text
Configuración avanzada → Continuar a localhost
```

---

## Carga de Datos de Prueba

La carpeta:

```text
database/tasks.json
```

contiene registros de ejemplo para la colección tasks.

Para cargarlos:

1. Ingresar a MongoDB Atlas.
2. Abrir la base de datos:

```text
todolist
```

3. Abrir la colección:

```text
tasks
```

4. Seleccionar:

```text
Add Data → Insert Document
```

5. Abrir el archivo:

```text
database/tasks.json
```

6. Copiar cada documento individualmente.
7. Insertar cada tarea en la colección.
8. Repetir el proceso hasta cargar todos los registros.

Una vez cargadas las tareas, la aplicación las mostrará automáticamente al iniciar.

---

## Iniciar Backend

Desde la carpeta backend ejecutar:

```bash
node server.js
```

Servidor HTTPS disponible en:

```text
https://localhost:3000
```

---

## Configuración del Frontend

Abrir una nueva terminal.

Entrar a la carpeta frontend:

```bash
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

```text
http://localhost:5173
```

---

---

## Endpoints Disponibles

### Autenticación

```http
POST /login
```

### Tareas

```http
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

### Archivos

```http
GET /files
POST /files
GET /files/download/:nombre
DELETE /files/:nombre
```

Todos los endpoints, excepto `/login`, requieren autenticación JWT mediante:

```http
Authorization: Bearer TOKEN
```

---

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
