import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getParticipantes } from '../../api/auth';


function Mercedes() {
  const navigate = useNavigate();
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const membros = await getParticipantes('Mercedes');
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
          Participantes da equipe: <span className="text-green-700">Mercedes</span>
        </h2>
      </header>

      {/* Conteúdo principal */}
      <main className="p-6 text-center">
        {/* Imagem da Mercedes */}
        <div className="mb-6">
          <img
            src="https://cdn-9.motorsport.com/images/mgl/0RrzmDo0/s8/mercedes-f1-logo-1.jpg"
            alt="Mercedes"
            className="mx-auto h-40 object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold mb-6 text-gray-800">Participantes da equipe Mercedes</h1>

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
                    <span className="text-sm text-gray-500">{membro.email}</span>
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

export default Mercedes;
