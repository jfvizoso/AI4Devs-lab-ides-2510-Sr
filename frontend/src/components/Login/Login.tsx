import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import './Login.css';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Mock: Enviar cualquier credencial
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">LTI - Talent Tracking System</h1>
        <h2 className="login-subtitle">Iniciar Sesión</h2>
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit} className="login-form">
          <Input
            label="Usuario"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ingresa cualquier usuario"
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingresa cualquier contraseña"
          />
          <Button type="submit" loading={loading}>
            Iniciar Sesión
          </Button>
        </form>
        <p className="login-hint">Nota: Este es un sistema mock. Cualquier credencial funcionará.</p>
      </div>
    </div>
  );
};

