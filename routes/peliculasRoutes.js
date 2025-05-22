const express = require('express');
const router = express.Router();
const peliculasController = require('../controller/peliculasController.js');
const verificarRol = require('../verificarRol.js');

//GET
router.get('/', peliculasController.consultaPelicula)

//POST
router.post('/', verificarRol('editor'), peliculasController.insertarPelicula)

//DELETE
router.delete('/', verificarRol('editor'), peliculasController.eliminarPelicula)

//PUT
router.put('/', verificarRol('editor'), peliculasController.modificarPelicula)

//PATCH
router.patch('/', verificarRol('editor'), peliculasController.actualizarPelicula)

module.exports.router=router;