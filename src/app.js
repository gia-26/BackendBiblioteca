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
import historialPrestamosRoutes from './routes/usuarios.routes.js';
import personalRoutes from './routes/personal.routes.js';
import bibliotecaRoutes from './routes/informacion_biblioteca.routes.js';
import generosRoutes from "./routes/generos.routes.js";
//import loginRoutes from './routes/login.routes.js';
import aniosRoutes from './routes/anio_edicion.routes.js';
import areasRoutes from './routes/area_conocimiento.routes.js';

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
app.use('/api/historialPrestamos', historialPrestamosRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/informacion_biblioteca', bibliotecaRoutes);
app.use("/generos", generosRoutes);
app.use('/api/anios', aniosRoutes);
app.use('/api/areas', areasRoutes);

app.get('/',(req, res)=>{
    res.send("Esto es mi primer API desde express... publicada en vercel...");
})


app.listen(port,()=>{
    console.log("Prueba el API desde localhost:"+port)
})