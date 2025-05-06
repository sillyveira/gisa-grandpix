import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  encerrarDesafio,
  getDesafioAtual,
  getHistoricoDesafios,
  getPontuacaoEquipes,
  selecionarVencedor,
} from "../../api/auth";

const teamStyles = {
  Ferrari: {
    bg: "bg-red-100",
    text: "text-red-700",
    banner:
      "https://assets.turbologo.com/blog/pt/2019/10/19133707/ferrari-logo-illustration.jpg",
  },
  McLaren: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    banner:
      "https://cdn-4.motorsport.com/images/mgl/YEQJgyLY/s800/mclaren-f1-team-logo-1.jpg",
  },
  Mercedes: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    banner:
      "https://cdn-9.motorsport.com/images/mgl/0RrzmDo0/s8/mercedes-f1-logo-1.jpg",
  },
  RedBull: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    banner:
      "https://cdn-9.motorsport.com/images/mgl/Y99JQRbY/s8/red-bull-racing-logo-1.jpg",
  },
  Sauber: {
    bg: "bg-green-100",
    text: "text-green-800",
    banner:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Sauber_F1_Team_logo.svg/1280px-Sauber_F1_Team_logo.svg.png",
  },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [desafio, setDesafio] = useState({
    nome: "Carregando...",
    imagem: "",
    regras: "",
    comoJogar: "",
    pontos: 0,
  });
  const [pontuacoes, setPontuacoes] = useState({});
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const desafioAtual = await getDesafioAtual();
        setDesafio(desafioAtual);

        const pontos = await getPontuacaoEquipes();
        const formatado = {};
        pontos.forEach((eq) => {
          formatado[eq.nome] = eq.pontos;
        });
        setPontuacoes(formatado);

        const data = await getHistoricoDesafios();
        setHistorico(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    fetchData();
  }, []);

  const alterarPontuacao = () => {
    navigate("/alterar-pontuacoes");
  };

  const verHistorico = () => {
    navigate("/historico-desafios", {
      state: {
        historico: historico,
      },
    });
  };

  const irParaDesafios = () => {
    navigate("/desafios");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex flex-row justify-evenly mb-6">
        <button
          className="bg-gray-800 text-white px-4 py-2 text-sm rounded hover:bg-gray-900"
          onClick={() => {
            navigate("/");
          }}
        >
          GP
        </button>
        <p className="text-xl font-bold">Painel do Administrador</p>
        <button
          className="bg-gray-800 text-white px-1 py-1 rounded hover:bg-gray-900"
          onClick={alterarPontuacao}
        >
          Alterar Pontuação
        </button>
      </header>

      {/* Desafio Atual */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-8">
        <h2 className="text-center text-2xl font-semibold">
          {desafio.nome}
        </h2>
        <h1 className="text-center text-red-500">{desafio.pontos} pontos</h1>
        <img
          src={desafio.imagem || null}
          alt={desafio.nome}
          className="h-40 mx-auto object-contain mb-4"
        />
        <p className="mb-2 text-center">{desafio.comoJogar}</p>
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={verHistorico}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Ver Histórico
          </button>

          <button
            onClick={async () => {
              await encerrarDesafio(localStorage.getItem("token"));
              navigate(0);
            }}
            disabled={desafio.pontos === 0}
            className={`px-4 py-2 rounded text-white
    ${
      desafio.pontos === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-red-500 hover:bg-red-600"
    }`}
          >
            Encerrar desafio
          </button>

          <button
            onClick={irParaDesafios}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Desafios
          </button>
        </div>
      </div>

      {/* Equipes para definir vencedor */}
      <h2 className="text-xl font-semibold mb-4">Definir Vencedor</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(teamStyles).map(([teamName, { bg, text, banner }]) => (
          <div
            key={teamName}
            className={`p-4 rounded-lg shadow ${bg} ${text} text-center`}
          >
            <img
              src={banner || null}
              alt={teamName}
              className="h-24 mx-auto object-contain mb-2"
            />
            <h3 className="text-lg font-semibold">{teamName}</h3>
            <p>
              Pontos:{" "}
              {pontuacoes[teamName] !== undefined
                ? pontuacoes[teamName]
                : "..."}
            </p>
            <button
              onClick={async () => {
                await selecionarVencedor(teamName, localStorage.getItem("token"));
                navigate(0);
              }}
              disabled={desafio.pontos === 0}
              className={`mt-2 px-4 py-2 rounded text-white
    ${
      desafio.pontos === 0
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
            >
              Definir como Vencedor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
