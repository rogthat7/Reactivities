import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import './app/layouts/styles.css'
import App from './app/layouts/App.tsx'
import { store, StoreContext } from './app/stores/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
    <App />
    </StoreContext.Provider>
  </StrictMode>,
)
