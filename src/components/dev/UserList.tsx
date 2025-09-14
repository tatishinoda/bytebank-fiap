// src/components/dev/UserList.tsx
// Componente simples para exibir usuários vindos da API POS

import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/UserService';

interface User {
  id: string;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os usuários ao montar o componente
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Carregando usuários...</div>;

  return (
    <div>
      <h2>Usuários da API POS</h2>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
