const db = require('../db');

exports.registrarTela = (req,res)=>{
  const { nombre, descripcion } = req.body;
  db.query('INSERT INTO catalogo (nombre_tela,descripcion) VALUES (?,?)',
  [nombre,descripcion], ()=>res.redirect('/inventario.html'));
};

exports.movimiento = (req,res)=>{
  const { tela_id, tipo, cantidad } = req.body;

  db.query('INSERT INTO movimientos (tela_id,tipo,cantidad) VALUES (?,?,?)',
  [tela_id,tipo,cantidad]);

  const q = tipo==='entrada'
    ? 'UPDATE catalogo SET stock=stock+? WHERE id=?'
    : 'UPDATE catalogo SET stock=stock-? WHERE id=?';

  db.query(q,[cantidad,tela_id], ()=>res.redirect('/dashboard.html'));
};
