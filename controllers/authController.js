const db = require('../db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, hash],
    (err) => {
      if (err) {
        console.error(err);
        return res.send('Error al registrar usuario');
      }
      res.redirect('/login.html');
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (err, results) => {
      if (results.length > 0 && await bcrypt.compare(password, results[0].password)) {
        req.session.user = results[0];
        res.redirect('/dashboard.html');
      } else {
        res.send('Credenciales incorrectas');
      }
    }
  );
};
