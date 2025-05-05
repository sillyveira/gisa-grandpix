const mongoose = require('mongoose');

const HistoricoSchema = new mongoose.Schema({
  desafio: { type: String, required: true },
  equipeVencedora: { type: String, required: true },
  pontos: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Historico', HistoricoSchema, 'historico');
