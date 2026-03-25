//Importamos la librería de express
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import prestamosRoutes from './routes/prestamos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import multasRoutes from './routes/multas.routes.js';
import inicioRoutes from './routes/inicio.routes.js';
import catalogoRoutes from './routes/catalogo.routes.js';
import librosRoutes from './routes/libros.routes.js';
import historialMultasRoutes from './routes/multas.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import personalRoutes from './routes/personal.routes.js';
import bibliotecaRoutes from './routes/informacion_biblioteca.routes.js';
import generosRoutes from "./routes/generos.routes.js";
import aniosRoutes from './routes/anio_edicion.routes.js';
import areasRoutes from './routes/area_conocimiento.routes.js';
import editorialesRoutes from './routes/editoriales.routes.js';
import tipoUsuariosRoutes from './routes/tipo_usuarios.routes.js';
import loginRoutes from './routes/login.routes.js';
import tiposPrestamoRoutes from './routes/tipos_prestamo.routes.js';
import perfilRoutes from './routes/perfil.routes.js';
import autoresRoutes from './routes/autores.routes.js';
import estimacionRoutes from './routes/estimacion.routes.js';


//Creamos el objeto de express para nuestra aplicación
const app = express();

//Configuramos dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();

//Definimos el puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;

app.use(cors());

//Definimos un middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

//Definimos las rutas de nuestra aplicación
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/inicio', inicioRoutes);
app.use('/api/historialmultas', historialMultasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/catalogo', catalogoRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/informacion_biblioteca', bibliotecaRoutes);
app.use("/api/generos", generosRoutes);
app.use('/api/anios', aniosRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/editoriales', editorialesRoutes);
app.use('/api/tipo_usuarios', tipoUsuariosRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/tipos_prestamo', tiposPrestamoRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/autores', autoresRoutes);
app.use('/api/estimaciones', estimacionRoutes);

app.get('/',(req, res)=>{
    res.send("Esto es mi primer API desde express... publicada en vercel...");
})


app.listen(port,()=>{
    console.log("Prueba el API desde localhost:"+port)
})