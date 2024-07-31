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
    <header className='headerBoard'>
      <h1>Kanban Board {networkStatusLabel}</h1>
    </header>
  );
}
