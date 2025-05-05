import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apagarDesafio as apagarDesafioAPI, criarDesafio, getDesafios, selecionarDesafio } from "../api/auth";

function Desafios() {
  const [desafios, setDesafios] = useState([]);
  const [desafioSelecionado, setDesafioSelecionado] = useState(null);

  const [novoDesafio, setNovoDesafio] = useState({
    nome: "",
    imagem: "",
    comoJogar: "",
    regras: "",
    pontos: "0",
    token: localStorage.getItem("token"),
  });
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") === "true";

  useEffect(() => {
    async function carregarDesafios() {
      try {
        const data = await getDesafios();
        setDesafios(data);
      } catch (err) {
        console.error("Erro ao carregar desafios:", err);
        alert("Erro ao buscar desafios do servidor.", err);
      }
    }

    carregarDesafios();
  }, []);

  const adicionarDesafio = async () => {
    const camposPreenchidos = Object.values(novoDesafio).every(
      (v) => v.trim() !== ""
    );
    if (!camposPreenchidos) return alert("Preencha todos os campos.");

    const novo = { ...novoDesafio, id: Date.now() };

    try {
      await criarDesafio(novo);
      setDesafios((prev) => [...prev, novo]);
      setNovoDesafio({
        _id: '',
        nome: "",
        imagem: "",
        comoJogar: "",
        regras: "",
        pontos: "0",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar o desafio. ", err);
    }
  };

  const apagarDesafio = async (_id) => {
    const token = localStorage.getItem('token');
  
    try {
      await apagarDesafioAPI({ _id: _id, token: token });
      setDesafios((prev) => prev.filter((d) => d._id !== _id));
    } catch (err) {
      console.error("Erro ao apagar desafio:", err);
      alert("Erro ao apagar o desafio.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Desafios</h1>
        <div></div>
      </header>

      {isAdmin && (
        <section className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Novo Desafio
          </h2>

          <input
            type="text"
            placeholder="Nome do desafio"
            value={novoDesafio.nome}
            onChange={(e) =>
              setNovoDesafio({ ...novoDesafio, nome: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="URL da imagem"
            value={novoDesafio.imagem}
            onChange={(e) =>
              setNovoDesafio({ ...novoDesafio, imagem: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Como jogar"
            value={novoDesafio.comoJogar}
            onChange={(e) =>
              setNovoDesafio({ ...novoDesafio, comoJogar: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Regras"
            value={novoDesafio.regras}
            onChange={(e) =>
              setNovoDesafio({ ...novoDesafio, regras: e.target.value })
            }
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Pontos"
            value={novoDesafio.pontos}
            onChange={(e) =>
              setNovoDesafio({ ...novoDesafio, pontos: e.target.value })
            }
            className="border p-2 rounded w-full mb-4"
          />

          <button
            onClick={adicionarDesafio}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Adicionar Desafio
          </button>
        </section>
      )}

      <main className="grid gap-4">
        {desafios.length === 0 ? (
          <p className="text-gray-600">Nenhum desafio disponível.</p>
        ) : (
          desafios.map((desafio) => (
            <div key={desafio._id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center gap-4">
                <img
                  src={desafio.imagem || null}
                  alt=""
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {desafio.nome}
                  </h3>
                  <p className="text-sm text-gray-600">{desafio.comoJogar}</p>
                </div>
              </div>

              <div className="mt-2 flex gap-2 justify-center">
                <button
                  onClick={() => setDesafioSelecionado(desafio)}
                  className="text-white hover:underline shadow bg-blue-600 px-2"
                >
                  Info
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        selecionarDesafio(localStorage.getItem('token'), desafio);
                        navigate('/admin')
                        navigate(0)
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Selecionar desafio
                    </button>
                    <button
                      onClick={() => {apagarDesafio(desafio._id)}}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </main>
      {desafioSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4">
              {desafioSelecionado.nome}
            </h2>

            <img
              src={desafioSelecionado.imagem}
              alt={desafioSelecionado.nome}
              className="w-full h-48 object-cover rounded mb-4"
            />

            <p className="mb-2">
              <strong>Como Jogar:</strong> {desafioSelecionado.comoJogar}
            </p>

            <p className="mb-2 whitespace-pre-line">
              <strong>Regras:</strong> {desafioSelecionado.regras}
            </p>

            <p>
              <strong>Pontos:</strong> {desafioSelecionado.pontos}
            </p>

            <button
              onClick={() => setDesafioSelecionado(null)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Desafios;
