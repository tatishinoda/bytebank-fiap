// src/services/UserService.ts
// Serviço para consumir o endpoint público de usuários da API POS

export async function fetchUsers() {
  // URL da API POS (ajuste se necessário)
  const apiUrl = 'http://localhost:3000/user';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar usuários');
    }
    // Retorna o array de usuários
    return await response.json();
  } catch (error) {
    // Em caso de erro, retorna vazio
    console.error(error);
    return [];
  }
}
