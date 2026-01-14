const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventarioController');

function auth(req,res,next){
  if(!req.session.user) return res.redirect('/login.html');
  next();
}

router.post('/tela', auth, controller.registrarTela);
router.post('/movimiento', auth, controller.movimiento);

module.exports = router;
