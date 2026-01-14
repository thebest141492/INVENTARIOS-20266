const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// REGISTRO
router.post('/register', (req, res) => {
  const { nombre, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO usuarios (nombre,email,password) VALUES (?,?,?)',
    [nombre, email, hash],
    err => {
      if (err) return res.send('Error al registrar');
      res.redirect('/login.html');
    }
  );
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email=?',
    [email],
    (err, results) => {
      if (results.length === 0) return res.send('Usuario no existe');

      const user = results[0];
      const ok = bcrypt.compareSync(password, user.password);

      if (!ok) return res.send('Contraseña incorrecta');

      req.session.user = user;

      if (user.forzar_password) {
        return res.redirect('/cambiar-password.html');
      }

      res.redirect('/dashboard.html');
    }
  );
});

// CAMBIAR PASSWORD USUARIO
router.post('/cambiar-password', (req, res) => {
  if (!req.session.user) return res.redirect('/login.html');

  const hash = bcrypt.hashSync(req.body.password, 10);

  db.query(
    'UPDATE usuarios SET password=?, forzar_password=0 WHERE id=?',
    [hash, req.session.user.id],
    () => res.redirect('/dashboard.html')
  );
});

module.exports = router;
