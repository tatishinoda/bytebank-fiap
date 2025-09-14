"use client";
// src/components/dev/LoginForm.tsx
// Componente de login simples para autenticar usuário na API POS

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { login, setToken } from '../../services/AuthService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = await login(email, password);
    if (token) {
      setToken(token);
      // Redireciona para o dashboard após login
      router.push('/dashboard');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <h2 className="text-lg font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Entrar</button>
    </form>
  );
};

export default LoginForm;
