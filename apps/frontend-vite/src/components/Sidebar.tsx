interface SidebarProps {
  onCreate: () => void;
}

export function Sidebar({ onCreate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">CD</div>
        <h3>Client Desk</h3>
        <p className="muted">Operações</p>
      </div>

      <nav className="nav">
        <button className="nav-item active" type="button">
          <span role="img" aria-label="dashboard">
            📊
          </span>
          Dashboard
        </button>
        <button className="nav-item" type="button" onClick={onCreate}>
          <span role="img" aria-label="cliente">
            👤
          </span>
          Novo cliente
        </button>
      </nav>

      <div className="sidebar-foot">
        <p className="muted">API</p>
        <code>VITE_API_URL</code>
      </div>
    </aside>
  );
}
