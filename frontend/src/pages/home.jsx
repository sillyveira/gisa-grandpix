import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDesafioAtual,
  getHistoricoDesafios,
  getPontuacaoEquipes,
} from "../api/auth";

const teamStyles = {
  Ferrari: {
    bg: "bg-red-100",
    text: "text-red-700",
    banner:
      "https://assets.turbologo.com/blog/pt/2019/10/19133707/ferrari-logo-illustration.jpg",
    points: 10,
  },
  McLaren: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    banner:
      "https://cdn-4.motorsport.com/images/mgl/YEQJgyLY/s800/mclaren-f1-team-logo-1.jpg",
    points: 9,
  },
  Mercedes: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    banner:
      "https://cdn-9.motorsport.com/images/mgl/0RrzmDo0/s8/mercedes-f1-logo-1.jpg",
    points: 9,
  },
  RedBull: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    banner:
      "https://cdn-9.motorsport.com/images/mgl/Y99JQRbY/s8/red-bull-racing-logo-1.jpg",
    points: 10,
  },
  Sauber: {
    bg: "bg-green-100",
    text: "text-green-800",
    banner:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Sauber_F1_Team_logo.svg/1280px-Sauber_F1_Team_logo.svg.png",
    points: 10,
  },
};

function Home() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState("");
  const [usuario, setUsuario] = useState("");
  const [pontuacoes, setPontuacoes] = useState({});
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState("");
  const [desafio, setDesafio] = useState({
    nome: "Carrregando...",
    imagem: "...",
    regras: "Carregando...",
    comoJogar: "...",
  });

  useEffect(() => {
    setEquipe(localStorage.getItem("equipe") || "");
    setUsuario(localStorage.getItem("user") || "");
    async function carregarDesafio() {
      try {
        const data = await getDesafioAtual();
        setDesafio(data);
      } catch (err) {
        console.error("Erro ao carregar desafio:", err);
      }
    }

    carregarDesafio();

    async function fetchPontuacoes() {
      try {
        const data = await getPontuacaoEquipes();
        const pontuacoesObj = {};
        data.forEach((equipe) => {
          pontuacoesObj[equipe.nome] = equipe.pontos;
        });
        setPontuacoes(pontuacoesObj);
      } catch (error) {
        console.error("Erro ao buscar pontuação das equipes:", error);
      }
    }

    fetchPontuacoes();

    async function loadHistoricoDesafios(setHistorico, setErro) {
      try {
        const data = await getHistoricoDesafios();
        setHistorico(data); // atualiza o state com o histórico
      } catch (error) {
        console.error("Erro ao carregar histórico de desafios:", error);
        setErro("Não foi possível carregar o histórico de desafios.");
      }
    }
    loadHistoricoDesafios(setHistorico, setErro);
  }, []);

  const handleLogout = () => {
    localStorage.setItem("authenticated", "false");
    localStorage.removeItem("equipe");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/welcome");
  };

  const team = teamStyles[equipe] || {};
  const bgClass = team.bg || "bg-gray-100";
  const textClass = team.text || "text-gray-800";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Olá, <span className={textClass}>{usuario || "Visitante"}</span>! |
          Equipe: <span className={textClass}>{equipe || "Nenhuma"}</span>
        </h2>
        {localStorage.getItem("user") === "admin" ? (
          <button
            onClick={()=>{navigate('/admin')}}
            className="bg-red-500 hover:bg-red-600 text-white px-4 mx-2 py-2 rounded cursor-pointer"
          >
            Admin
          </button>
        ) : (
          <></>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Deslogar
        </button>
      </header>

      {/* Conteúdo principal */}
      <main className="p-6 text-center">
        {team.banner && (
          <img
            src={team.banner}
            alt={equipe}
            className="mx-auto h-40 object-contain mb-6"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">Bem-vindo, {usuario}!</h1>
        <p className={`text-lg ${textClass}`}>
          Você está representando a equipe <strong>{equipe}</strong>. Prepare-se
          para o GrandPix!
        </p>

        {/* Desafio Atual */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold ">
           {desafio.nome}
          </h3>
          {desafio.pontos > 0 && (
            <h2 className="text-center font-semibold text-red-500">{desafio.pontos} pontos</h2>
          )}
          <img
            src={desafio.imagem || null}
            alt={desafio.nome}
            className="mx-auto h-40 object-contain mb-1 mt-4"
          />
          
          <p className="text-lg mb-4">{desafio.comoJogar}</p>
          <div className="flex flex-col gap-2 w-auto items-center">
            <button
              onClick={() => {
                navigate("/desafio-atual", {
                  state: {
                    nome: desafio.nome,
                    imagem: desafio.imagem,
                    comoJogar: desafio.comoJogar,
                    regras: desafio.regras,
                    pontos: desafio.pontos
                  },
                });
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-fit"
            >
              Ver Regras
            </button>
            <button
              onClick={() => {
                navigate("/historico-desafios", {
                  state: {
                    historico: historico,
                  },
                });
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-fit"
            >
              Histórico dos desafios
            </button>
            <button
              onClick={() => {
                navigate('/desafios');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-fit"
            >
              Lista de desafios
            </button>
          </div>
        </div>

        {/* Cards das equipes */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(teamStyles).map(
            ([teamName, { bg, text, banner }]) => (
              <div
                key={teamName}
                className={`p-6 rounded-lg shadow-lg ${bg} ${text} flex flex-col items-center`}
              >
                <img
                  src={banner || null}
                  alt={teamName}
                  className="h-24 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold">{teamName}</h3>
                <p className="text-sm mb-4">
                  Pontos:{" "}
                  {pontuacoes[teamName] !== undefined
                    ? pontuacoes[teamName]
                    : "Carregando..."}
                </p>
                <button
                  onClick={() => navigate(`/participantes/${teamName}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Participantes
                </button>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
