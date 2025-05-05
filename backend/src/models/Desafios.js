const mongoose = require('mongoose');

const Desafios = new mongoose.Schema({
  nome: { type: String, required: true },
  imagem: {type: String, required: true},
  regras: { type: String, required: true },
  comoJogar: { type: String, required: true },
  pontos: {type: Number, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Desafios', Desafios, 'desafios');
