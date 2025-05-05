// src/api/auth.jsx
const BASE_URL = 'http://localhost:3000'; // <-- altere aqui se mudar o backend

export async function criarDesafio(dados) {
  const res = await fetch(`${BASE_URL}/criar-desafio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar desafio");
  }

  return await res.json();
}

export async function encerrarDesafio(token) {
  const res = await fetch(`${BASE_URL}/encerrar-desafio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao encerrar desafio");
  }

  return await res.json();
}

export async function selecionarVencedor(nomeEquipe, token) {
  const res = await fetch(`${BASE_URL}/selecionar-vencedor/${nomeEquipe}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao selecionar vencedor");
  }

  return await res.json();
}

export async function selecionarDesafio(token, desafio) {
  const res = await fetch(`${BASE_URL}/selecionar-desafio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token, desafio: desafio }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao selecionar desafio");
  }

  return await res.json();
}

export async function apagarDesafio(dados) {
  const res = await fetch(`${BASE_URL}/desafios/${dados._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token: dados.token}),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar desafio");
  }

  return await res.json();
}

export async function getDesafios() {
  const res = await fetch(`${BASE_URL}/desafios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar desafios");
  }

  return await res.json();
}

export async function getVagasPorEquipe() {
  const res = await fetch(`${BASE_URL}/vagas-por-equipe`, {
    method: 'GET',
    credentials: 'include', // se for necessário para cookies/sessão
  });

  if (!res.ok) {
    throw new Error('Erro ao buscar membros por equipe');
  }

  return await res.json();
}

export async function getPontuacaoEquipes() {
  try {
    const response = await fetch(`${BASE_URL}/pontuacao-equipes`); // ajuste a URL conforme seu backend

    if (!response.ok) {
      throw new Error('Erro ao buscar pontuação das equipes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar pontuação das equipes:', error);
    throw error;
  }
}

export async function getHistoricoDesafios() {
  try {
    const response = await fetch(`${BASE_URL}/historico-desafios`);

    if (!response.ok) {
      throw new Error('Erro ao buscar histórico de desafios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico de desafios:', error);
    throw error;
  }
}

export async function atualizarPontuacaoEquipe(nomeEquipe, novosPontos) {
  const res = await fetch(`${BASE_URL}/equipes/${nomeEquipe}/pontuacao`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pontos: novosPontos }),
  });
  if (!res.ok) {
    throw new Error('Erro ao atualizar pontuação');
  }
  return res.json();
}


export async function getDesafioAtual() {
  try {
    const response = await fetch(`${BASE_URL}/desafio-atual`); // ajuste a URL conforme seu backend

    if (!response.ok) {
      throw new Error('Falha ao buscar o desafio atual');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar o desafio atual:', error);
    throw error;
  }
}

export const getParticipantes = async (equipeNome) => {
  try {
    const response = await fetch(`${BASE_URL}/equipes/${equipeNome}/participantes`);
    if (!response.ok) {
      throw new Error('Erro ao buscar participantes');
    }
    const data = await response.json();
    return data.membros; // Retorna os membros da equipe
  } catch (error) {
    console.error(error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json(); 

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao fazer login');
  }

  // ✅ Armazena token e dados no localStorage
  localStorage.setItem('authenticated', 'true');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', data.username);
  localStorage.setItem('equipe', data.equipe)

  return data;
}

export async function register(username, password, equipeSelecionada) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, equipeSelecionada }),
  });
  const data = await res.json(); 

  if (!res.ok) {
    throw new Error(data.message || 'Erro ao fazer o registro');
  }

 
  localStorage.setItem('authenticated', 'true');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', data.username);
  localStorage.setItem('equipe', data.equipe)

  return data;
}