import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { AuthResponse, AuthUser, Client, ClientPayload } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { ClientModal } from './components/ClientModal';
import { ClientList } from './components/ClientList';

const STORAGE_TOKEN_KEY = 'clientdesk:token';
const STORAGE_USER_KEY = 'clientdesk:user';

const emptyClient: ClientPayload = {
  name: '',
  email: '',
  document: '',
  phone: '',
  status: 'active',
};

function App() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const active = clients.filter((c) => c.status === 'active').length;
    return [
      { label: 'Clientes ativos', value: active },
      { label: 'Clientes inativos', value: clients.length - active },
      { label: 'Total', value: clients.length },
    ];
  }, [clients]);

  useEffect(() => {
    if (token) {
      loadClients(token);
    }
  }, [token]);

  const persistAuth = (data: AuthResponse) => {
    setToken(data.accessToken);
    setUser(data.user);
    localStorage.setItem(STORAGE_TOKEN_KEY, data.accessToken);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    setClients([]);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const loadClients = async (sessionToken: string) => {
    setLoadingClients(true);
    setError(null);
    try {
      const data = await api.fetchClients(sessionToken);
      setClients(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      setError(message);
      if (message.toLowerCase().includes('sessão')) {
        clearAuth();
      }
    } finally {
      setLoadingClients(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);
    try {
      const auth = await api.login(email, password);
      persistAuth(auth);
      await loadClients(auth.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setAuthLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (payload: ClientPayload) => {
    if (!token) return;
    setSavingClient(true);
    setError(null);
    try {
      if (editingClient) {
        const updated = await api.updateClient(editingClient.id, payload, token);
        setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await api.createClient(payload, token);
        setClients((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setSavingClient(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    if (!token) return;
    const confirmed = window.confirm(`Deseja remover ${client.name}?`);
    if (!confirmed) return;

    setError(null);
    try {
      await api.deleteClient(client.id, token);
      setClients((prev) => prev.filter((c) => c.id !== client.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover cliente');
    }
  };

  if (!token || !user) {
    return <LoginView loading={authLoading} error={error} onLogin={handleLogin} />;
  }

  return (
    <div className="page">
      <Sidebar onCreate={openCreateModal} />
      <div className="main">
        <Header user={user} onLogout={clearAuth} />
        <main className="content">
          <section className="hero">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1>Clientes em um só lugar</h1>
              <p className="muted">
                Centralize autenticação, cadastre clientes, acompanhe status e mantenha tudo
                atualizado com poucos cliques.
              </p>
              <div className="hero-actions">
                <button className="button primary" onClick={openCreateModal}>
                  Novo cliente
                </button>
                <button className="button ghost" onClick={() => loadClients(token)}>
                  Atualizar lista
                </button>
              </div>
            </div>
            <div className="hero-card">
              <p className="muted">Sessão</p>
              <h3>{user.email}</h3>
              <p className="muted">Token ativo</p>
            </div>
          </section>

          <section className="stats">
            {stats.map((item) => (
              <div key={item.label} className="stat-card">
                <p className="muted">{item.label}</p>
                <h2>{item.value}</h2>
              </div>
            ))}
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Clientes</h3>
                <p className="muted">Crie, edite ou remova clientes autenticados</p>
              </div>
              <button className="button primary" onClick={openCreateModal}>
                + Cliente
              </button>
            </div>

            {error && <div className="alert">{error}</div>}

            <ClientList
              clients={clients}
              loading={loadingClients}
              onEdit={openEditModal}
              onDelete={handleDeleteClient}
            />
          </section>
        </main>
      </div>

      {isModalOpen && (
        <ClientModal
          initialValue={editingClient ?? emptyClient}
          saving={savingClient}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
}

export default App;
