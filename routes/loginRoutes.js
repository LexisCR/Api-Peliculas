const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const verificarToken = require('../verificarToken');
const verificarRol = require('../verificarRol');

const router = express.Router();

const privateKey = fs.readFileSync(path.join(__dirname, '../Llaves/privada.pem'), 'utf-8');

router.post('/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const query = 'SELECT * FROM usuarios WHERE correo = ?';

  db.query(query, [correo], async (err, results) => {
    if (err) {
      console.error('Error en consulta:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = results[0];

    // Verificar contraseña con bcrypt
    const match = await bcrypt.compare(password, usuario.password);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1h'
    });

    res.json({ token });
  });
});

//

router.post('/register', verificarToken, verificarRol('editor'),async (req, res) => {
  const { correo, password, rol } = req.body;

  if (!correo || !password || !rol) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO usuarios (correo, password, rol) VALUES (?, ?, ?)';

  db.query(query, [correo, hashedPassword, rol], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }

    res.status(201).json({ mensaje: 'Usuario registrado' });
  });
});
module.exports = router;
