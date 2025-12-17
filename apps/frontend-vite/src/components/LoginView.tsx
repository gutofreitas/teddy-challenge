import { FormEvent, useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

export function LoginView({ onLogin, loading, error }: LoginViewProps) {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <p className="eyebrow">Client Desk</p>
        <h1>Entre para gerenciar clientes</h1>
        <p className="muted">
          Faça login com o admin seeded ou com um usuário que você criar via API. Tudo roda com o
          backend Nest que já está pronto.
        </p>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        <div className="logo large">CD</div>
        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@dominio.com"
            required
          />
        </div>
        <div className="field">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            required
          />
        </div>
        {error && <div className="alert">{error}</div>}
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="muted small">Use o admin seeded no backend ou cadastre um novo usuário.</p>
      </form>
    </div>
  );
}
