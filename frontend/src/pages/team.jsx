import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Team() {
  const [team, setTeam] = useState(null);
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
    const teamName = localStorage.getItem('equipe');
    if (!teamName) {
      navigate('/register'); // segurança: se não tiver equipe, volta pro registro
      return;
    }

    const selectedTeam = teams.find(t => t.name === teamName);
    if (!selectedTeam) {
      navigate('/register'); // se equipe inválida
      return;
    }

    setTeam(selectedTeam);
  }, [navigate]);

  if (!team) return <p className="text-center mt-10">Carregando sua equipe...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-center mb-4">🎉 Parabéns! 🎉</h1>
      <h2 className="text-xl font-semibold mb-6 text-center">Você foi selecionado para a equipe:</h2>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h3 className="text-2xl font-bold text-red-600 mb-4">{team.name}</h3>
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-48 object-contain mb-4"
        />
        <p className="text-gray-700 italic mb-6">{team.message}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Página inicial
        </button>
      </div>
    </div>
  );
}

export default Team;
