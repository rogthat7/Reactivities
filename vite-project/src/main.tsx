import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css'
import './app/layouts/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router'
import { router } from './app/router/Routes.tsx'
import { store } from './app/lib/stores/store.ts'
import { storeContext } from './app/lib/stores/store.ts'
import { ToastContainer } from 'react-toastify'


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <storeContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="colored" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </storeContext.Provider>

  </StrictMode>,
)
