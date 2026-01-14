const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

// BODY
app.use(bodyParser.urlencoded({ extended: true }));

// ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// SESIÓN
app.use(session({
  secret: 'inventarios_secret',
  resave: false,
  saveUninitialized: false
}));

// ============================
// LOGIN PAGE
// ============================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ============================
// REGISTRO (POST)
// ============================
app.post('/register', (req, res) => {
  const { nombre, email, password, confirm } = req.body;

  if (!nombre || !email || !password || !confirm) {
    return res.send('Faltan datos');
  }

  if (password !== confirm) {
    return res.send('Las contraseñas no coinciden');
  }

  const hash = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO usuarios (nombre, email, password, rol, forzar_password)
    VALUES (?, ?, ?, 'usuario', 0)
  `;

  db.query(sql, [nombre, email, hash], (err) => {
    if (err) {
      console.error('❌ Error registro:', err);
      return res.send('Error al registrar (correo duplicado)');
    }

    res.redirect('/');
  });
});

// ============================
// LOGIN (POST)
// ============================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    (err, results) => {
      if (err) return res.send('Error del servidor');
      if (results.length === 0) return res.send('Usuario no encontrado');

      const user = results[0];

      if (!bcrypt.compareSync(password, user.password)) {
        return res.send('Contraseña incorrecta');
      }

      // GUARDAR SESIÓN
      req.session.user = {
        id: user.id,
        email: user.email,
        rol: user.rol
      };

      res.redirect('/dashboard.html');
    }
  );
});

// ============================
// SESSION INFO
// ============================
app.get('/session-info', (req, res) => {
  if (!req.session.user) {
    return res.json({ logged: false });
  }
  res.json({
    logged: true,
    rol: req.session.user.rol
  });
});

// ============================
// LISTAR USUARIOS (ADMIN)
// ============================
app.get('/api/usuarios', (req, res) => {
  if (!req.session.user || req.session.user.rol !== 'admin') {
    return res.status(403).json([]);
  }

  db.query(
    'SELECT id, nombre, email, rol FROM usuarios',
    (err, rows) => {
      if (err) return res.status(500).json([]);
      res.json(rows);
    }
  );
});

// ============================
// RESET PASSWORD (ADMIN))
// ============================
app.post('/api/reset-password/:id', (req, res) => {
  if (!req.session.user || req.session.user.rol !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const tempPassword = Math.random().toString(36).slice(-8);
  const hash = bcrypt.hashSync(tempPassword, 10);

  db.query(
    'UPDATE usuarios SET password=?, forzar_password=1 WHERE id=?',
    [hash, req.params.id],
    () => {
      res.json({ message: `Contraseña temporal: ${tempPassword}` });
    }
  );
});

// ============================
// SERVERrrr
// ============================
app.listen(3000, () => {
  console.log('🔥 Servidor activo en http://localhost:3000');
});
