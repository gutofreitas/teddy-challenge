import styles from './page.module.css';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome frontend 👋
            </h1>
          </div>

          <div id="hero" className="rounded">
            <div className="text-container">
              <h2>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    'use client';

                    import { FormEvent, useEffect, useState } from 'react';
                    import styles from './page.module.css';

                    type Client = {
                      id: string;
                      name: string;
                      email: string;
                      document?: string;
                      phone?: string;
                      status: string;
                      createdAt: string;
                      updatedAt: string;
                    };

                    type UserProfile = {
                      id: string;
                      email: string;
                      roles: string[];
                    };

                    type ClientPayload = {
                      name: string;
                      email: string;
                      document?: string;
                      phone?: string;
                      status: string;
                    };

                    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

                    const emptyClient: ClientPayload = {
                      name: '',
                      email: '',
                      document: '',
                      phone: '',
                      status: 'active',
                    };

                    const loadSavedAuth = () => {
                      if (typeof window === 'undefined') return { token: null, user: null };

                      const token = window.localStorage.getItem('teddy_token');
                      const user = window.localStorage.getItem('teddy_user');

                      return {
                        token,
                        user: user ? (JSON.parse(user) as UserProfile) : null,
                      };
                    };

                    export default function Index() {
                      const [{ token, user }, setAuth] = useState(loadSavedAuth());
                      const [clients, setClients] = useState<Client[]>([]);
                      const [clientForm, setClientForm] = useState<ClientPayload>(emptyClient);
                      const [editingId, setEditingId] = useState<string | null>(null);
                      const [authForm, setAuthForm] = useState({ email: '', password: '' });
                      const [loading, setLoading] = useState(false);
                      const [message, setMessage] = useState<string | null>(null);
                      const [error, setError] = useState<string | null>(null);

                      const setAuthState = (newToken: string | null, newUser: UserProfile | null) => {
                        if (typeof window !== 'undefined') {
                          if (newToken && newUser) {
                            window.localStorage.setItem('teddy_token', newToken);
                            window.localStorage.setItem('teddy_user', JSON.stringify(newUser));
                          } else {
                            window.localStorage.removeItem('teddy_token');
                            window.localStorage.removeItem('teddy_user');
                          }
                        }

                        setAuth({ token: newToken, user: newUser });
                      };

                      const apiRequest = async <T,>(
                        path: string,
                        options: RequestInit = {}
                      ): Promise<T> => {
                        const headers: Record<string, string> = {
                          'Content-Type': 'application/json',
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        };

                        const response = await fetch(`${API_BASE}${path}`, {
                          ...options,
                          headers,
                        });

                        const body = response.headers.get('content-type')?.includes('application/json')
                          ? await response.json()
                          : null;

                        if (!response.ok) {
                          const detail = (body as { message?: string })?.message ?? response.statusText;
                          throw new Error(Array.isArray(detail) ? detail.join(', ') : detail);
                        }

                        return body as T;
                      };

                      const loadClients = async (jwt?: string) => {
                        if (!token && !jwt) return;
                        try {
                          const items = await apiRequest<Client[]>('/clients');
                          setClients(items);
                        } catch (err) {
                          setError((err as Error).message);
                        }
                      };

                      useEffect(() => {
                        if (token) {
                          loadClients(token);
                        }
                      }, [token]);

                      const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        setLoading(true);
                        setError(null);
                        setMessage(null);

                        try {
                          const result = await apiRequest<{
                            accessToken: string;
                            user: UserProfile;
                          }>('/auth/login', {
                            method: 'POST',
                            body: JSON.stringify(authForm),
                          });

                          setAuthState(result.accessToken, result.user);
                          setAuthForm({ email: '', password: '' });
                          setMessage('Autenticado com sucesso.');
                        } catch (err) {
                          setError((err as Error).message);
                        } finally {
                          setLoading(false);
                        }
                      };

                      const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        setLoading(true);
                        setError(null);
                        setMessage(null);

                        try {
                          const result = await apiRequest<{
                            accessToken: string;
                            user: UserProfile;
                          }>('/auth/register', {
                            method: 'POST',
                            body: JSON.stringify(authForm),
                          });

                          setAuthState(result.accessToken, result.user);
                          setAuthForm({ email: '', password: '' });
                          setMessage('Usuário criado e autenticado.');
                        } catch (err) {
                          setError((err as Error).message);
                        } finally {
                          setLoading(false);
                        }
                      };

                      const handleLogout = () => {
                        setAuthState(null, null);
                        setClients([]);
                        setEditingId(null);
                        setClientForm(emptyClient);
                      };

                      const handleClientSubmit = async (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        if (!token) {
                          setError('Autentique-se para gerenciar clientes.');
                          return;
                        }

                        setLoading(true);
                        setError(null);
                        setMessage(null);

                        try {
                          if (editingId) {
                            await apiRequest(`/clients/${editingId}`, {
                              method: 'PUT',
                              body: JSON.stringify(clientForm),
                            });
                            setMessage('Cliente atualizado.');
                          } else {
                            await apiRequest('/clients', {
                              method: 'POST',
                              body: JSON.stringify(clientForm),
                            });
                            setMessage('Cliente criado.');
                          }

                          setClientForm(emptyClient);
                          setEditingId(null);
                          await loadClients();
                        } catch (err) {
                          setError((err as Error).message);
                        } finally {
                          setLoading(false);
                        }
                      };

                      const startEdit = (client: Client) => {
                        setEditingId(client.id);
                        setClientForm({
                          name: client.name,
                          email: client.email,
                          document: client.document ?? '',
                          phone: client.phone ?? '',
                          status: client.status,
                        });
                      };

                      const handleDelete = async (id: string) => {
                        if (!token) return;
                        setLoading(true);
                        setError(null);
                        setMessage(null);

                        try {
                          await apiRequest(`/clients/${id}`, { method: 'DELETE' });
                          setClients((prev) => prev.filter((client) => client.id !== id));
                          setMessage('Cliente removido.');
                        } catch (err) {
                          setError((err as Error).message);
                        } finally {
                          setLoading(false);
                        }
                      };

                      const heroCopy = user
                        ? `Bem-vindo, ${user.email}. Role(s): ${user.roles.join(', ')}`
                        : 'Autentique-se para acessar o CRUD de clientes.';

                      return (
                        <main className={styles.page}>
                          <div className={styles.shell}>
                            <section className={styles.hero}>
                              <div>
                                <p className={styles.tag}>Teddy · NX Monorepo</p>
                                <h1>Login + Clientes</h1>
                                <p className={styles.subtitle}>{heroCopy}</p>
                                <p className={styles.hint}>
                                  Admin seed: <strong>admin@teddy.local</strong> / <strong>admin123</strong>
                                </p>
                              </div>
                              <div className={styles.heroBadge}>
                                <span>{clients.length} clientes</span>
                                <span>{user ? 'Autenticado' : 'Visitante'}</span>
                              </div>
                            </section>

                            <section className={styles.grid}>
                              <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                  <div>
                                    <p className={styles.cardEyebrow}>Sessão</p>
                                    <h2>{user ? 'Perfil' : 'Login / Registro'}</h2>
                                  </div>
                                  {user && (
                                    <button className={styles.linkButton} onClick={handleLogout}>
                                      Sair
                                    </button>
                                  )}
                                </div>

                                {!user ? (
                                  <div className={styles.formStack}>
                                    <form className={styles.form} onSubmit={handleLogin}>
                                      <label>
                                        Email
                                        <input
                                          type="email"
                                          value={authForm.email}
                                          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                          required
                                        />
                                      </label>
                                      <label>
                                        Senha
                                        <input
                                          type="password"
                                          value={authForm.password}
                                          onChange={(e) =>
                                            setAuthForm({ ...authForm, password: e.target.value })
                                          }
                                          required
                                        />
                                      </label>
                                      <div className={styles.actions}>
                                        <button type="submit" disabled={loading}>
                                          Entrar
                                        </button>
                                        <button
                                          type="button"
                                          className={styles.ghost}
                                          onClick={handleRegister}
                                          disabled={loading}
                                        >
                                          Registrar
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                ) : (
                                  <div className={styles.profileBox}>
                                    <p className={styles.muted}>Email</p>
                                    <p>{user.email}</p>
                                    <p className={styles.muted}>Roles</p>
                                    <p>{user.roles.join(', ')}</p>
                                  </div>
                                )}

                                {message && <p className={styles.success}>{message}</p>}
                                {error && <p className={styles.error}>{error}</p>}
                              </div>

                              <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                  <div>
                                    <p className={styles.cardEyebrow}>Clientes</p>
                                    <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>
                                  </div>
                                  {editingId && (
                                    <button
                                      className={styles.linkButton}
                                      onClick={() => {
                                        setEditingId(null);
                                        setClientForm(emptyClient);
                                      }}
                                    >
                                      Cancelar edição
                                    </button>
                                  )}
                                </div>

                                <form className={styles.form} onSubmit={handleClientSubmit}>
                                  <label>
                                    Nome
                                    <input
                                      value={clientForm.name}
                                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                                      required
                                    />
                                  </label>
                                  <label>
                                    Email
                                    <input
                                      type="email"
                                      value={clientForm.email}
                                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                                      required
                                    />
                                  </label>
                                  <div className={styles.split}>
                                    <label>
                                      Documento
                                      <input
                                        value={clientForm.document}
                                        onChange={(e) =>
                                          setClientForm({ ...clientForm, document: e.target.value })
                                        }
                                      />
                                    </label>
                                    <label>
                                      Telefone
                                      <input
                                        value={clientForm.phone}
                                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                                      />
                                    </label>
                                  </div>
                                  <label>
                                    Status
                                    <select
                                      value={clientForm.status}
                                      onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                                    >
                                      <option value="active">Ativo</option>
                                      <option value="inactive">Inativo</option>
                                    </select>
                                  </label>

                                  <div className={styles.actions}>
                                    <button type="submit" disabled={loading || !token}>
                                      {editingId ? 'Salvar alterações' : 'Criar cliente'}
                                    </button>
                                    {!token && (
                                      <p className={styles.muted}>Faça login para salvar.</p>
                                    )}
                                  </div>
                                </form>
                              </div>
                            </section>

                            <section className={styles.card}>
                              <div className={styles.cardHeader}>
                                <div>
                                  <p className={styles.cardEyebrow}>Lista</p>
                                  <h2>Clientes cadastrados</h2>
                                </div>
                                <span className={styles.badge}>{clients.length} itens</span>
                              </div>

                              {clients.length === 0 ? (
                                <p className={styles.muted}>Nenhum cliente cadastrado ainda.</p>
                              ) : (
                                <div className={styles.tableWrapper}>
                                  <table className={styles.table}>
                                    <thead>
                                      <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Atualizado</th>
                                        <th>Ações</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {clients.map((client) => (
                                        <tr key={client.id}>
                                          <td>{client.name}</td>
                                          <td>{client.email}</td>
                                          <td>
                                            <span
                                              className={
                                                client.status === 'active'
                                                  ? styles.statusActive
                                                  : styles.statusInactive
                                              }
                                            >
                                              {client.status}
                                            </span>
                                          </td>
                                          <td>
                                            {new Date(client.updatedAt ?? client.createdAt).toLocaleString('pt-BR')}
                                          </td>
                                          <td className={styles.actionsCell}>
                                            <button
                                              className={styles.linkButton}
                                              onClick={() => startEdit(client)}
                                              disabled={!token}
                                            >
                                              Editar
                                            </button>
                                            <button
                                              className={styles.danger}
                                              onClick={() => handleDelete(client.id)}
                                              disabled={!token || loading}
                                            >
                                              Remover
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </section>
                          </div>
                        </main>
                      );
                    }
                    <path d="m36 30h7.53v2.19h-5v1.44h4.49v2h-4.42v1.49h5v2.21h-7.6z" />
                    <path d="m47.23 32.29h-2.8v-2.29h8.21v2.27h-2.81v7.1h-2.6z" />
                    <path d="m29.13 43.08h4.42a3.53 3.53 0 0 1 2.55.83 2.09 2.09 0 0 1 .6 1.53 2.16 2.16 0 0 1 -1.44 2.09 2.27 2.27 0 0 1 1.86 2.29c0 1.61-1.31 2.59-3.55 2.59h-4.44zm5 2.89c0-.52-.42-.8-1.18-.8h-1.29v1.64h1.24c.79 0 1.25-.26 1.25-.81zm-.9 2.66h-1.57v1.73h1.62c.8 0 1.24-.31 1.24-.86 0-.5-.4-.87-1.27-.87z" />
                    <path d="m38 43.08h4.1a4.19 4.19 0 0 1 3 1 2.93 2.93 0 0 1 .9 2.19 3 3 0 0 1 -1.93 2.89l2.24 3.27h-3l-1.88-2.84h-.87v2.84h-2.56zm4 4.5c.87 0 1.39-.43 1.39-1.11 0-.75-.54-1.12-1.4-1.12h-1.44v2.26z" />
                    <path d="m49.59 43h2.5l4 9.44h-2.79l-.67-1.69h-3.63l-.67 1.69h-2.71zm2.27 5.73-1-2.65-1.06 2.65z" />
                    <path d="m56.46 43.05h2.6v9.37h-2.6z" />
                    <path d="m60.06 43.05h2.42l3.37 5v-5h2.57v9.37h-2.26l-3.53-5.14v5.14h-2.57z" />
                    <path d="m68.86 51 1.45-1.73a4.84 4.84 0 0 0 3 1.13c.71 0 1.08-.24 1.08-.65 0-.4-.31-.6-1.59-.91-2-.46-3.53-1-3.53-2.93 0-1.74 1.37-3 3.62-3a5.89 5.89 0 0 1 3.86 1.25l-1.26 1.84a4.63 4.63 0 0 0 -2.62-.92c-.63 0-.94.25-.94.6 0 .42.32.61 1.63.91 2.14.46 3.44 1.16 3.44 2.91 0 1.91-1.51 3-3.79 3a6.58 6.58 0 0 1 -4.35-1.5z" />
                  </g>
                </svg>
                <span>
                  Install Nx Console for JetBrains
                  <span>
                    Available for WebStorm, Intellij IDEA Ultimate and more!
                  </span>
                </span>
              </a>
              <div id="nx-cloud" className="rounded shadow">
                <div>
                  <svg
                    id="nx-cloud-logo"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    fill="transparent"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M23 3.75V6.5c-3.036 0-5.5 2.464-5.5 5.5s-2.464 5.5-5.5 5.5-5.5 2.464-5.5 5.5H3.75C2.232 23 1 21.768 1 20.25V3.75C1 2.232 2.232 1 3.75 1h16.5C21.768 1 23 2.232 23 3.75Z"
                    />
                    <path
                      strokeWidth="2"
                      d="M23 6v14.1667C23 21.7307 21.7307 23 20.1667 23H6c0-3.128 2.53867-5.6667 5.6667-5.6667 3.128 0 5.6666-2.5386 5.6666-5.6666C17.3333 8.53867 19.872 6 23 6Z"
                    />
                  </svg>
                  <h2>
                    Nx Cloud
                    <span>Enable faster CI & better DX</span>
                  </h2>
                </div>
                <p>
                  You can activate distributed tasks executions and caching by
                  running:
                </p>
                <pre>nx connect</pre>
                <a
                  href="https://nx.app/?utm_source=nx-project"
                  target="_blank"
                  rel="noreferrer"
                >
                  {' '}
                  What is Nx Cloud?{' '}
                </a>
              </div>
              <a
                id="nx-repo"
                className="button-pill rounded shadow"
                href="https://github.com/nrwl/nx?utm_source=nx-project"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>
                  Nx is open source
                  <span> Love Nx? Give us a star! </span>
                </span>
              </a>
            </div>
          </div>

          <div id="commands" className="rounded shadow">
            <h2>Next steps</h2>
            <p>Here are some things you can do with Nx:</p>
            <details>
              <summary>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Add UI library
              </summary>
              <pre>
                <span># Generate UI lib</span>
                nx g @nx/next:library ui
                <span># Add a component</span>
                nx g @nx/next:component ui/src/lib/button
              </pre>
            </details>
            <details>
              <summary>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                View project details
              </summary>
              <pre>nx show project frontend --web</pre>
            </details>
            <details>
              <summary>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                View interactive project graph
              </summary>
              <pre>nx graph</pre>
            </details>
            <details>
              <summary>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Run affected commands
              </summary>
              <pre>
                <span># see what&apos;s been affected by changes</span>
                nx affected:graph
                <span># run tests for current changes</span>
                nx affected:test
                <span># run e2e tests for current changes</span>
                nx affected:e2e
              </pre>
            </details>
          </div>

          <p id="love">
            Carefully crafted with
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
