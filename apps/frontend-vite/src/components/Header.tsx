import { useState } from 'react';
import { AuthUser } from '../types';

interface HeaderProps {
  user: AuthUser;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="brand">
        <div className="logo">CD</div>
        <div>
          <p className="eyebrow">Client Desk</p>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="user-menu">
        <button className="user-chip" onClick={() => setOpen((v) => !v)}>
          <span className="avatar">{user.email[0]?.toUpperCase()}</span>
          <span>{user.email}</span>
          <span className="chevron">▾</span>
        </button>
        {open && (
          <div className="menu">
            <button className="menu-item" onClick={onLogout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
