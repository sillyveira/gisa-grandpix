const mongoose = require('mongoose');

const EquipeSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  pontos: { type: Number, default: 0 },
  desafiosVencidos: { type: Number, default: 0 }
});

module.exports = mongoose.model('Equipe', EquipeSchema);
