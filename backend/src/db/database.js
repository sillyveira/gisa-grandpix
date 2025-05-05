const mongoose = require('mongoose');
const Equipe = require('../models/Equipe'); // ajuste o caminho se necessário
const DesafioAtual = require('../models/DesafioAtual');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("[SUCESSO] Conexão estabelecida com o banco");

    const equipesPreDefinidas = ['Ferrari', 'McLaren', 'Mercedes', 'RedBull', 'Sauber'];

    for (const nome of equipesPreDefinidas) {
      const existe = await Equipe.findOne({ nome });
      if (!existe) {
        await Equipe.create({ nome });
        console.log(`[INFO] Equipe "${nome}" criada.`);
      }
    }

    const existente = await DesafioAtual.findOne();
    if (!existente) {
      await DesafioAtual.create({
        nome: "Nenhum desafio ativo",
        regras: "Aguardando novo desafio.",
        imagem: "https://t4.ftcdn.net/jpg/05/13/33/85/360_F_513338597_W58B8AOOb6EPqfpalPhjZgXLCsWw0opu.jpg",
        comoJogar: "Será exibido aqui quando um novo desafio começar.",
        pontos: 0
      });
      console.log("[INFO] Desafio atual padrão criado.");
    } else {
      console.log("[INFO] Desafio atual já existe.");
    }

  })
  .catch((err) => console.error("[ERRO] A conexão falhou: ", err));

module.exports = mongoose;
