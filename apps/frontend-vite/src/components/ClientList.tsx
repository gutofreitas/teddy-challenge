import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientList({ clients, loading, onEdit, onDelete }: ClientListProps) {
  if (loading) {
    return <div className="skeleton">Carregando clientes...</div>;
  }

  if (!clients.length) {
    return <div className="empty">Nenhum cliente ainda. Clique em "Novo cliente" para começar.</div>;
  }

  return (
    <div className="clients">
      {clients.map((client) => (
        <article key={client.id} className="client-card">
          <div>
            <div className="client-heading">
              <h4>{client.name}</h4>
              <span className={`badge ${client.status === 'active' ? 'success' : 'muted-badge'}`}>
                {client.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="muted">{client.email}</p>
            {client.phone && <p className="muted">{client.phone}</p>}
          </div>
          <div className="client-actions">
            <button className="button ghost" onClick={() => onEdit(client)}>
              Editar
            </button>
            <button className="button danger" onClick={() => onDelete(client)}>
              Remover
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
