import NavBar from './NavBar';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router';

function App() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f5f5f5' }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ flexGrow: 1, padding: '2rem', bgcolor: '#f5f5f5' }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default App
