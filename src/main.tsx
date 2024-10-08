import ReactDOM from 'react-dom/client';
import App from './App';
import {registerSW} from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('offline ready');
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
