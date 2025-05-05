const Equipe = require('../models/Equipe');
const User = require('../models/User');


exports.verificarVagas = async () => {

    const resultado = {};
    const maxMembros = 10;

    const equipes = await Equipe.find();

    for (const equipe of equipes) {
        const totalMembros = await User.countDocuments({ equipe: equipe._id });
        const vagasRestantes = Math.max(0, maxMembros - totalMembros);
        resultado[equipe.nome] = vagasRestantes;
    }

    return resultado;
}
exports.verificarVagasPorEquipe = async (req, res) => {
    const result = await exports.verificarVagas();
    res.status(200).json({ equipes: result });
}



