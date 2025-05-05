import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getVagasPorEquipe } from '../api/auth';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');
  const [vagas, setVagas] = useState({});
  const navigate = useNavigate();

  const teams = [
    {
      name: 'Ferrari',
      image: 'https://assets.turbologo.com/blog/pt/2019/10/19133707/ferrari-logo-illustration.jpg',
      message: 'Velocidade, paixão e tradição. Você é puro sangue vermelho!',
    },
    {
      name: 'McLaren',
      image: 'https://cdn-4.motorsport.com/images/mgl/YEQJgyLY/s800/mclaren-f1-team-logo-1.jpg',
      message: 'Inovador e ousado — seu talento está à frente do tempo!',
    },
    {
      name: 'Mercedes',
      image: 'https://cdn-9.motorsport.com/images/mgl/0RrzmDo0/s8/mercedes-f1-logo-1.jpg',
      message: 'Precisão, elegância e potência. O domínio das pistas está com você!',
    },
    {
      name: 'RedBull',
      image: 'https://cdn-9.motorsport.com/images/mgl/Y99JQRbY/s8/red-bull-racing-logo-1.jpg',
      message: 'Você nasceu para competir e voar mais alto. Energia total na pista!',
    },
    {
      name: 'Sauber',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Sauber_F1_Team_logo.svg/1280px-Sauber_F1_Team_logo.svg.png',
      message: 'Discreto, mas eficiente. Você surpreende com consistência e estratégia!',
    },
  ];

  useEffect(() => {
    getVagasPorEquipe()
      .then((res) => setVagas(res.equipes))
      .catch(() => setError('Erro ao carregar vagas.'));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!/^[A-Za-z]{1,10}$/.test(username)) {
        throw new Error('Nome deve conter até 10 letras (somente letras).');
      }

      if (!/^\d{3}$/.test(password)) {
        throw new Error('Senha deve conter exatamente 3 dígitos numéricos.');
      }

      if (!selectedTeam) {
        throw new Error('Você deve escolher uma equipe.');
      }

      if (vagas[selectedTeam] === 0) {
        throw new Error('Não há vagas restantes para esta equipe.');
      }

      await register(username, password, selectedTeam);

      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('equipe', selectedTeam);

      navigate('/equipe');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Registro</h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome (até 10 letras)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha (3 dígitos)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Escolha sua equipe:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => {
              const vagasRestantes = vagas[team.name] ?? '—';
              const isDisabled = vagasRestantes === 0;

              return (
                <div
                  key={team.name}
                  className={`cursor-pointer border-4 rounded p-4 text-center shadow transition-colors duration-200 ${
                    selectedTeam === team.name
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-400'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (!isDisabled) setSelectedTeam(team.name);
                  }}
                >
                  <img
                    src={team.image}
                    alt={team.name}
                    className="h-24 object-contain mx-auto mb-2"
                  />
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{team.message}</p>
                  <p className="text-sm font-medium text-gray-800">
                    Vagas restantes: {vagasRestantes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="text-center">Equipe selecionada: {selectedTeam ?? "---"}</h2>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        >
          Registrar
        </button>

        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Register;
