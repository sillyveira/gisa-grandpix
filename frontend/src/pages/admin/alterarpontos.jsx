import { useEffect, useState } from 'react';
import { getPontuacaoEquipes, atualizarPontuacaoEquipe } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const teamStyles = {
  Ferrari: { bg: 'bg-red-100', text: 'text-red-700' },
  McLaren: { bg: 'bg-orange-100', text: 'text-orange-700' },
  Mercedes: { bg: 'bg-gray-100', text: 'text-gray-800' },
  RedBull: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Sauber: { bg: 'bg-green-100', text: 'text-green-800' },
};

function AlterarPontuacoes() {
  const [pontuacoes, setPontuacoes] = useState({});
  const [novosPontos, setNovosPontos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPontuacaoEquipes();
        const pontos = {};
        data.forEach((e) => {
          pontos[e.nome] = e.pontos;
        });
        setPontuacoes(pontos);
        setNovosPontos(pontos);
      } catch (err) {
        console.error('Erro ao buscar pontuações:', err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (equipe, valor) => {
    setNovosPontos({ ...novosPontos, [equipe]: parseInt(valor) });
  };

  const salvarAlteracoes = async () => {
    try {
      for (const equipe in novosPontos) {
        if (novosPontos[equipe] !== pontuacoes[equipe]) {
          await atualizarPontuacaoEquipe(equipe, novosPontos[equipe]);
        }
      }
      navigate('/admin');
    } catch (err) {
      console.error('Erro ao atualizar pontuações:', err);
      alert('Erro ao atualizar pontuações.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Alterar Pontuação</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Voltar
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(teamStyles).map(([equipe, { bg, text }]) => (
          <div key={equipe} className={`p-4 rounded-lg shadow ${bg} ${text}`}>
            <h2 className="text-xl font-semibold mb-2">{equipe}</h2>
            <p>Pontuação atual: {pontuacoes[equipe] ?? '...'}</p>
            <input
              type="number"
              className="mt-2 p-2 border rounded w-full"
              value={novosPontos[equipe] ?? ''}
              onChange={(e) => handleChange(equipe, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={salvarAlteracoes}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

export default AlterarPontuacoes;
