import { FormEvent, useEffect, useState } from 'react';
import { ClientPayload, ClientStatus } from '../types';

interface ClientModalProps {
  initialValue: ClientPayload;
  saving: boolean;
  onSave: (payload: ClientPayload) => void;
  onClose: () => void;
}

const statusOptions: ClientStatus[] = ['active', 'inactive'];

export function ClientModal({ initialValue, saving, onSave, onClose }: ClientModalProps) {
  const [form, setForm] = useState<ClientPayload>(initialValue);

  useEffect(() => setForm(initialValue), [initialValue]);

  const handleChange = (key: keyof ClientPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Cliente</p>
            <h3>{initialValue.name ? 'Editar cliente' : 'Novo cliente'}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar modal">
            ✕
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Documento</label>
            <input
              type="text"
              value={form.document ?? ''}
              onChange={(e) => handleChange('document', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input
              type="text"
              value={form.phone ?? ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.status ?? 'active'}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {statusOptions.map((status) => (
                <option value={status} key={status}>
                  {status === 'active' ? 'Ativo' : 'Inativo'}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button className="button ghost" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="button primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
