# Chat en Tiempo Real

Este es un proyecto de chat en tiempo real desarrollado con Angular en el frontend y Node.js con Express en el backend. La aplicación permite a los usuarios enviar mensajes de texto, imágenes y GIFs en tiempo real, con soporte para notificaciones de sonido y un tema oscuro/claro.

## Características

- **Chat en tiempo real:** Los mensajes se envían y reciben en tiempo real utilizando Server-Sent Events (SSE).
- **Envío de imágenes:** Los usuarios pueden subir imágenes (hasta 5MB) que se procesan y muestran en el chat.
- **Tema oscuro/claro:** Los usuarios pueden alternar entre un tema oscuro y claro.
- **Notificaciones de sonido:** Se reproduce un sonido de notificación cuando se recibe un nuevo mensaje.
- **Historial de chat:** Los mensajes anteriores se cargan automáticamente cuando un usuario se une al chat.

## Tecnologías Utilizadas

### Frontend:

- Angular (TypeScript)
- Angular Material (UI components)
- RxJS (Manejo de streams y eventos)

### Backend:

- Node.js
- Express
- Multer (Manejo de subida de archivos)
- Sharp (Procesamiento de imágenes)

### Otras herramientas:

- Server-Sent Events (SSE) para comunicación en tiempo real.
- LocalStorage para guardar preferencias del usuario (tema oscuro/claro).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js:** Asegúrate de tener Node.js instalado. Puedes descargarlo desde [aquí](https://nodejs.org/).
- **Angular CLI:** Instala Angular CLI globalmente si no lo tienes:

```bash
npm install -g @angular/cli
```

## Configuración del Proyecto

### 1. Clonar el Repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/chat-app.git
cd chat-app
```

### 2. Instalar Dependencias

Instala las dependencias tanto para el frontend como para el backend.

#### Frontend (Angular):

```bash
cd frontend
npm install
```

#### Backend (Node.js):

```bash
cd backend
npm install
```

## Ejecución del Proyecto

### 1. Iniciar el Backend

Navega a la carpeta del backend y ejecuta el servidor:

```bash
cd backend
node server.js
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

### 2. Iniciar el Frontend

Navega a la carpeta del frontend y ejecuta la aplicación Angular:

```bash
cd frontend
ng serve
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200).

## Estructura del Proyecto

### Frontend (`frontend`)

- `src/app/components/chat`: Contiene el componente principal del chat.
- `src/app/services/chat.service.ts`: Servicio para manejar la comunicación con el backend.
- `src/app/models/message.model.ts`: Modelos de datos para mensajes y usuarios.
- `src/assets/sounds/notification.mp3`: Sonido de notificación para nuevos mensajes.

### Backend (`backend`)

- `server.js`: Servidor principal que maneja las conexiones SSE, la subida de imágenes y el historial de chat.
- `uploads/`: Carpeta donde se almacenan temporalmente las imágenes subidas (si se usa almacenamiento en disco).

## Configuración Adicional

### Cambiar el Puerto del Backend

Si deseas cambiar el puerto del backend, modifica la siguiente línea en `server.js`:

```javascript
const PORT = 3000; // Cambia este valor
```

### Cambiar el Puerto del Frontend

Si deseas cambiar el puerto del frontend, ejecuta Angular con el siguiente comando:

```bash
ng serve --port 4201
```

## Contribuir

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo `LICENSE`.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

- **Nombre:** [Alexander Forero]
- **Email:** [foreroalex2@gmail.com]
- **GitHub:** [ForeroAlexander](https://github.com/ForeroAlexander)

¡Gracias por usar esta aplicación de chat en tiempo real! 🚀
