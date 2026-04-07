import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as loginModels from '../models/login.models.js';

export const login = async (req, res) => {
    try {
        const sesion  = req.body.sesion;
        const idUsuario = req.body.idUsuario;
        const password = req.body.password;

        const usuario = await loginModels.findUsuarioById(idUsuario, sesion);
        if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });
        if (usuario.rol !== sesion) return res.status(403).json({ message: 'Credenciales inválidas' });

        const esValida = await bcrypt.compare(password, usuario.password_hash);
        if (!esValida) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ success: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};