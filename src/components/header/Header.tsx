export function Header() {
  const isOnline = navigator.onLine;
  const networkStatusLabel = (
    <sup
      className={`networkStatus ${isOnline ? 'onlineStatus' : 'offlineStatus'}`}
    >
      ({isOnline ? 'online' : 'offline'})
    </sup>
  );
  return (
    <header>
      <h1>Kanban board1 {networkStatusLabel}</h1>
    </header>
  );
}
