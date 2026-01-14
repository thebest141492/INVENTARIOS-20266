const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.rol !== 'admin') {
    return res.status(403).send('Acceso denegadoooo eff');
  }
  next();
}

// LISTAR USUARIOS
router.get('/admin/usuarios', isAdmin, (req, res) => {
  db.query(
    'SELECT id,nombre,email,rol FROM usuarios',
    (err, results) => res.json(results)
  );
});

// RESET PASSWORDdd
router.post('/admin/reset-password', isAdmin, (req, res) => {
  const { userId } = req.body;

  const tempPassword = crypto.randomBytes(4).toString('hex');
  const hash = bcrypt.hashSync(tempPassword, 10);

  db.query(
    'UPDATE usuarios SET password=?, forzar_password=1 WHERE id=?',
    [hash, userId],
    () => res.json({ tempPassword })
  );
});

module.exports = router;
