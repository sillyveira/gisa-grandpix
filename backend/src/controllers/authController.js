const User = require('../models/User');
const mongoose = require('mongoose');
const Equipe = require('../models/Equipe');
const crypto = require('crypto');
const { verificarVagas } = require('./equipeController');

const EQUIPES_PRE_DEFINIDAS = ['Ferrari', 'McLaren', 'Mercedes', 'RedBull', 'Sauber'];

function gerarTokenAleatorio(tamanho = 10) {
  return crypto.randomBytes(tamanho).toString('base64').slice(0, tamanho);
}



exports.register = async (req, res) => {
  const { username, password, equipeSelecionada } = req.body;

  try {
    
    //Usuário existe?
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }
    // Equipe existe?
    const equipesValidas = ["Ferrari", "McLaren", "Mercedes", "Sauber", "RedBull"];
    if (!equipesValidas.includes(equipeSelecionada)){
      return res.status(400).json({message: 'Equipe inválida'})
    }
    // Equipe tem vaga?
    const vagas = await verificarVagas();
    if (!vagas[equipeSelecionada] || vagas[equipeSelecionada] <= 0) {
      return res.status(400).json({ message: 'Essa equipe está cheia' });
    }
    const novoToken = gerarTokenAleatorio(10);

    const selectedTeam = await Equipe.findOne({nome: equipeSelecionada})
    if (!selectedTeam) {
      return res.status(400).json({message: "Erro na seleção de equipe"});
    }

    const newUser = new User({equipe: selectedTeam._id, token: novoToken, username: username, password: password });
    await newUser.save();

    return res.status(200).json({ message: 'Registro bem-sucedido', token: newUser.token, equipe: newUser.equipe?.nome || 'undefined', username: newUser.username});
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }).populate('equipe');
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    return res.status(200).json({ message: 'Login bem-sucedido', token: user.token, equipe: user.equipe?.nome || 'undefined', username: user.username});
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
