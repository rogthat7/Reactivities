import NavBar from './NavBar';
import { Box, Container } from '@mui/material';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';

function App() {
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f5f5f5' }}>
      <ScrollRestoration />
      {
        location.pathname === '/' ? (
          <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5' }}>
            <HomePage />
          </Box>
        ) : (
          <>
          <NavBar />
          <Container maxWidth="xl" sx={{ flexGrow: 1, padding: '5rem', bgcolor: '#f5f5f5' }}>
            <Outlet />
          </Container>
          </>
        )
      }
     
    </Box>
  )
}

export default App
