import { MenuItem } from "@mui/material";
import { NavLink } from "react-router";

export default function MenuItemLink({children, to}:{children: React.ReactNode, to: string}) {
  return (
    <MenuItem 
    component={NavLink} to={to}
    sx={{
        textDecoration: 'none',
        fontSize: '1.2rem',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'inherit',
        '&.active': {
            backgroundColor: '#1e90ff',
            color: '#ff7f50',
        },
        '&:hover': {
            backgroundColor: '#1e90ff',
            color: '#1976d2',
        },
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',  
    }}
    >
        {children}
    </MenuItem>
  )
}
