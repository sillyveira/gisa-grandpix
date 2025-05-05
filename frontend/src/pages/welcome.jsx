import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images2.alphacoders.com/121/1215709.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-5xl font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">🎪 GrandPix da Gisa 🎪</h1>
        <p className="text-xl mb-8 animate__animated animate__fadeIn animate__delay-2s">Venha celebrar conosco uma festa cheia de magia e diversão!</p>
        <div className="flex gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 animate__animated animate__fadeIn animate__delay-3s">
            Registrar
          </Link>
          <Link to="/login" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 animate__animated animate__fadeIn animate__delay-3s">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
