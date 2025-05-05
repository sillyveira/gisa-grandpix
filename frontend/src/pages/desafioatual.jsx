import { useNavigate, useLocation } from 'react-router-dom';

function DesafioAtual() {
  const navigate = useNavigate();
  const location = useLocation();

  // Desestrutura os dados passados via navigate(state)
  const {
    nome = 'Desafio de Qualificação Batatal',
    imagem = 'https://tempersonalizados.com.br/wp-content/uploads/2017/06/5-dicas-para-organizar-uma-gincana-incrivel-1000x640-1.jpg',
    comoJogar = 'Vista seu melhor traje de corredor, entre no saco de batatas e complete 3 voltas rápidas sem cair.',
    regras = `1. Use um saco de batatas padrão.\n2. Não é permitido pular com o saco fora dos limites da pista.\n3. Cada volta deve ser registrada por um juiz oficial.\n4. Os 3 melhores tempos ganham pontos extras!`,
    pontos = '0'
  } = location.state || {};

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header com botão de voltar */}
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Desafio Atual
        </h1>
        <div></div>
      </header>

      {/* Conteúdo do desafio */}
      <main className="max-w-3xl mx-auto text-center bg-gray-50 p-6 rounded-lg shadow-md">
        <img
          src={imagem || null}
          alt={nome}
          className="mx-auto mb-6 rounded-md h-60 object-cover"
        />
        <h2 className="text-3xl font-bold text-gray-800 mb-1">{nome}</h2>
        {pontos > 0  && (
          <h4 className="font-bold text-red-500">{pontos} pontos</h4>
        )}
        

        <div className="text-left">
          <h3 className="text-xl font-semibold text-blue-600 mt-4 mb-2">Como Jogar:</h3>
          <p className="text-gray-700 mb-4">{comoJogar}</p>

          <h3 className="text-xl font-semibold text-blue-600 mb-2">Regras:</h3>
          <pre className="bg-white p-4 text-gray-700 whitespace-pre-wrap rounded-md border border-gray-300">
            {regras}
          </pre>
        </div>
      </main>
    </div>
  );
}

export default DesafioAtual;
