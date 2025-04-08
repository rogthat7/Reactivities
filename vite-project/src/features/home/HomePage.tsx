import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { Link } from 'react-router'

export default function HomePage() {
  return (
    <Paper 
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      gap:6,
      backgroundImage:'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'
    }}
    >
      <Box sx={{ alignItems: 'center',alignContent:'center', color: '#fff' }}>
        <img src="/assets/logo.png" alt="Logo" style={{ width: '150px', height: '150px', marginBottom: '1rem' }} />
        <Typography variant="h1" fontWeight='bold' style={{ color: '#fff' }}>Reactivities</Typography>
        <Typography variant="h3" fontWeight='bold'>Welcome to Reactivities</Typography>
        <Button variant="contained"
           color="primary" 
           sx={{ marginTop: '1rem', backgroundColor: '#fff', color: '#182a73', fontWeight: 'bold' }}
           component = {Link}
           to="/activities"> 
          Take me to Activities
        </Button> 
      </Box>
    </Paper>
  )
}
