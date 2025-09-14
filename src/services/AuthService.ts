// src/services/AuthService.ts
// Serviço para autenticação de usuário na API POS

export async function login(email: string, password: string) {
  const apiUrl = 'http://localhost:3000/user/auth';
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      throw new Error('Credenciais inválidas');
    }
  // Retorna o token recebido da API (corrigido para data.result.token)
  const data = await response.json();
  return data.result?.token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Função para armazenar o token no localStorage
export function setToken(token: string) {
  localStorage.setItem('authToken', token);
}

// Função para recuperar o token
export function getToken() {
  return localStorage.getItem('authToken');
}

// Função para remover o token
export function logout() {
  localStorage.removeItem('authToken');
}
