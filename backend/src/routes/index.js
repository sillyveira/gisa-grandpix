const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");
const { verificarVagasPorEquipe } = require("../controllers/equipeController");
const User = require("../models/User");
const Equipe = require("../models/Equipe");
const DesafioAtual = require("../models/DesafioAtual");
const Historico = require("../models/Historico");
const Desafios = require("../models/Desafios");

router.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});


router.get("/", homeController.index);

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/vagas-por-equipe", verificarVagasPorEquipe);

router.get("/desafio-atual", async (req, res) => {
  try {
    const desafio = await DesafioAtual.findOne().sort({ createdAt: -1 }); // Pega o mais recente
    if (!desafio) {
      return res
        .status(404)
        .json({ message: "Nenhum desafio atual encontrado." });
    }

    res.status(200).json({
      nome: desafio.nome,
      imagem: desafio.imagem,
      regras: desafio.regras,
      comoJogar: desafio.comoJogar,
      pontos: desafio.pontos
    });
  } catch (error) {
    console.error("Erro ao buscar desafio atual:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get("/historico-desafios", async (req, res) => {
  try {
    const historico = await Historico.find().sort({ createdAt: -1 }); // do mais recente ao mais antigo
    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico de desafios:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get("/desafios", async (req, res) => {
  try {
    const desafios = await Desafios.find().sort({ createdAt: -1 });
    res.status(200).json(desafios);
  } catch (error) {
    console.error("Erro ao buscar desafios: ", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.post("/criar-desafio", async (req,res) => {
  try {
    const {token, nome, regras, comoJogar, pontos, imagem} = req.body;
    if(token != '68'){
      return res.status(500).json({message: "Você não é Wesley Silveira"});
    }
    
    await Desafios.create({nome, imagem, regras, comoJogar, pontos});
    res.status(200).json({message: 'O desafio foi criado com sucesso.'});
  } catch (error) {
    res.status(500).json({message: error})
  }
})

const encerrarDesafio = async() => {
  await DesafioAtual.deleteOne();
  await DesafioAtual.create({
    nome: "Nenhum desafio ativo",
    regras: "Aguardando novo desafio.",
    imagem: "https://t4.ftcdn.net/jpg/05/13/33/85/360_F_513338597_W58B8AOOb6EPqfpalPhjZgXLCsWw0opu.jpg",
    comoJogar: "Será exibido aqui quando um novo desafio começar.",
    pontos: 0
  });
}

router.post("/encerrar-desafio", async(req,res) => {
  try {
    const {token} = req.body
    if (token != '68') {
      return res.status(500).json({message: "Você não é Wesley Silveira"});
    }

    await encerrarDesafio();
    
    res.status(200).json({message: "O desafio foi encerrado."})
  } catch (error) {

  }
})

router.post("/selecionar-vencedor/:nomeEquipe", async (req,res) => {
  const {nomeEquipe} = req.params;
  const {token} = req.body;

  const equipeSelecionada = await Equipe.findOne({nome: nomeEquipe})
  const desafioAtual = await DesafioAtual.findOne();

  if(token != '68'){
    return res.status(500).json({message:"Você não é Wesley Silveira"});
  }

  if (!equipeSelecionada){
    return res.status(500).json({message:"A equipe não existe"});
  }

  if (!desafioAtual.pontos){
    return res.status(500).json({message:"O desafio atual não tem pontos para tornar alguma equipe vencedora."});
  }
  //----

  await Historico.create({desafio: desafioAtual.nome, equipeVencedora: equipeSelecionada.nome, pontos: desafioAtual.pontos});
  await Equipe.updateOne(
    {nome: equipeSelecionada.nome},
    {$inc: {pontos: desafioAtual.pontos}}
    )
  await encerrarDesafio();

  return res.status(200).json({message: `A equipe ${equipeSelecionada.nome} recebeu ${desafioAtual.pontos}.`})

})

router.post('/selecionar-desafio', async(req,res)=>{

  const {token, desafio} = req.body;
  const desafioAtual = await DesafioAtual.findOne();

  if(token != '68'){
     return res.status(500).json({message:"Você não é Wesley Silveira"});
  }

  if (desafioAtual.pontos > 0){
    return res.status(500).json({message:"O desafio atual precisa ser encerrado antes de iniciar outro."});
  }

  await DesafioAtual.deleteOne();

  await DesafioAtual.create({
    nome: desafio.nome,
    imagem: desafio.imagem,
    comoJogar: desafio.comoJogar,
    regras: desafio.regras,
    pontos: desafio.pontos
  })

  res.status(200).json({message: "O desafio foi selecionado com sucesso."});

})

router.delete("/desafios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.body;

    if (token !== '68') {
      return res.status(500).json({ message: "Você não é Wesley Silveira" });
    }

    const desafioDeletado = await Desafios.findByIdAndDelete(id);

    if (!desafioDeletado) {
      return res.status(404).json({ message: "Desafio não encontrado" });
    }

    res.status(200).json({ message: "Desafio deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar desafio: ", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


router.get("/pontuacao-equipes", async (req, res) => {
  try {
    const equipes = await Equipe.find({}, "nome pontos").sort({ pontos: -1 }); // ordena por pontos desc

    res.status(200).json(equipes);
  } catch (error) {
    console.error("Erro ao buscar pontuação das equipes:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get("/equipes/:nome/participantes", async (req, res) => {
  const nomeEquipe = req.params.nome;

  try {
    const equipe = await Equipe.findOne({ nome: nomeEquipe });

    if (!equipe) {
      return res.status(404).json({ message: "Equipe não encontrada" });
    }

    const membros = await User.find({ equipe: equipe._id }).select(
      "-password -token"
    ); // oculta senha e token

    res.status(200).json({ equipe: nomeEquipe, membros });
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Atualiza a pontuação da equipe
router.put("/equipes/:nome/pontuacao", async (req, res) => {
  const nomeEquipe = req.params.nome;
  const { pontos } = req.body;

  if (typeof pontos !== "number") {
    return res.status(400).json({ message: "Pontuação inválida" });
  }

  try {
    const equipe = await Equipe.findOneAndUpdate(
      { nome: nomeEquipe },
      { pontos },
      { new: true }
    );

    if (!equipe) {
      return res.status(404).json({ message: "Equipe não encontrada" });
    }

    res.status(200).json({
      message: "Pontuação atualizada com sucesso",
      equipe: {
        nome: equipe.nome,
        pontos: equipe.pontos,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar pontuação:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
