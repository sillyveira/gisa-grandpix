import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParticipantes, removerParticipante } from '../../api/auth';

function Ferrari() {
  const navigate = useNavigate();
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = localStorage.getItem("admin") === "true";
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const membros = await getParticipantes('Ferrari');
        setParticipantes(membros);
      } catch (err) {
        setError('Erro ao carregar participantes');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)} // Navega para a página anterior
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          Participantes da equipe: <span className="text-red-700">Ferrari</span>
        </h2>
      </header>

      {/* Conteúdo principal */}
      <main className="p-6 text-center">
        {/* Imagem da Ferrari */}
        <div className="mb-6">
          <img
            src="https://assets.turbologo.com/blog/pt/2019/10/19133707/ferrari-logo-illustration.jpg"
            alt="Ferrari"
            className="mx-auto h-40 object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 text-gray-800">Participantes da equipe Ferrari</h1>

        {loading ? (
          <p className="text-lg text-gray-600">Carregando participantes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {participantes.length > 0 ? (
              <ul className="space-y-4">
                {participantes.map((membro) => (
                  <li
                    key={membro._id}
                    className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-800">{membro.username}</span>

                    {isAdmin && (<button
                      onClick={async() => { 
                        const dados = {
                          token: token,
                          _id: membro._id
                        }
                        await removerParticipante(dados);
                        navigate(0);
                       }} // Navega para a página anterior
                      className="bg-red-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Remover
                    </button>)}

                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhum participante encontrado.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Ferrari;
