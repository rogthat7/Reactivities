import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router";

export default function ServerError() {
    const {state} = useLocation();
  return (
    <Paper>
        {state?.error ? (
            <>
            <Typography color="error" gutterBottom variant="h3" sx={{ px: 4, pt:2 }}>
                {state.error.message || 'Internal Server error'}
            </Typography>
            <Divider/>
            <Typography gutterBottom variant="body1" sx={{ px: 4}}>
                {state.error.detail || 'Internal Server error'}
            </Typography>
            </>
            
        ): (
            <Typography gutterBottom variant="h3" sx={{ px: 4, pt:2 }}>
                Server error
            </Typography>
        )}
    </Paper>
  )
}