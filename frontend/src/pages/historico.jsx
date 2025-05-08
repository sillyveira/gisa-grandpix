import { useLocation, useNavigate } from 'react-router-dom';
import { removerHistorico } from '../api/auth';

function HistoricoDesafios() {
  const location = useLocation();
  const navigate = useNavigate();
  const historico = location.state?.historico || [];
  const isAdmin = localStorage.getItem('admin') === 'true';
  const token = localStorage.getItem('token');
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Histórico de Desafios
        </h1>
        <div></div>
      </header>

      <main className="grid gap-6">
        {historico.length === 0 ? (
          <p className="text-gray-600">Nenhum desafio registrado.</p>
        ) : (
          historico.map((item, index) => {
            const teamColors = {
              Ferrari: 'bg-red-100 text-red-700',
              RedBull: 'bg-blue-100 text-blue-800',
              Mercedes: 'bg-gray-100 text-gray-800',
              McLaren: 'bg-orange-100 text-orange-700',
              Sauber: 'bg-green-100 text-green-800',
            };
            const colors = teamColors[item.equipeVencedora] || 'bg-white text-gray-800';

            return (
              <div
                key={index}
                className={`p-4 rounded shadow-md flex flex-row items-center justify-between ${colors}`}
              >
                <div>
                <h3 className="text-xl font-semibold">{item.desafio}</h3>
                <p className="text-sm">Equipe vencedora: {item.equipeVencedora}</p>
                <p className="text-sm font-bold">Pontos ganhos: {item.pontos}</p>
                </div>
                {isAdmin && (<button
                      onClick={async() => { 
                        const dados = {
                          token: token,
                          _id: item._id
                        }
                        await removerHistorico(dados);
                        navigate(-1);
                       }} 
                      className="bg-red-500 hover:bg-blue-600 h-fit text-white px-4 py-2 rounded"
                    >
                      Remover
                    </button>)}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default HistoricoDesafios;
