import { SearchOff } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Paper
          elevation={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <SearchOff sx={{ fontSize: 100, color: 'primary' }} />
          <Typography variant="h3" sx={{ mt: 2 }}>
            We couldn't find what you are looking for.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} component={Link} to="/activities">
           <Typography  color="white">Go back to activities</Typography> 
          </Button>
      </Paper>

  )
}