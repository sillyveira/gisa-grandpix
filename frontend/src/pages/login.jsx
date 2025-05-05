import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!/^[A-Za-z]{1,10}$/.test(username)) {
                throw new Error('Nome inválido (até 10 letras, apenas letras).');
            }
            if (!/^\d{3}$/.test(password)) {
                throw new Error('Senha deve conter exatamente 3 dígitos numéricos.');
            }

            await login(username, password);
            localStorage.setItem('authenticated', 'true');
            if(username=='admin'){
                localStorage.setItem('admin', true);
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nome de usuário"
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
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Entrar
                </button>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => {navigate('/register')}}
                >
                    Registre-se
                </button>
            </form>
        </div>
    );
}

export default Login;
