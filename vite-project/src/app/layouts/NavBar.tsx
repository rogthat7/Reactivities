import { AppBar, Box, Container, LinearProgress, MenuItem, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { Observer } from "mobx-react-lite";
import { useStore } from "../lib/hooks/useStore";
export default function NavBar() {
    const {UIStore} = useStore(); // Create an instance of UIStore
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="static" 
            sx={{ backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
                position: 'sticky',
             }}>
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <MenuItem component={NavLink} to="/" sx={{ display: 'flex', alignItems: 'center', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <img src="/assets/logo.png" alt="Logo" style={{ width: '50px', height: '50px', marginRight: '1rem' }} />
                                <Typography variant="h4" fontWeight='bold' style={{ color: '#fff' }}>Reactivities</Typography>
                            </MenuItem>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <MenuItemLink to='/activities'>
                                <Typography fontWeight='bold' style={{ color: '#fff' }}>Activities</Typography>
                            </MenuItemLink>
                            <MenuItemLink to='/createActivity' >
                                <Typography fontWeight='bold' style={{ color: '#fff' }}>Create Activity</Typography>
                            </MenuItemLink>
                            <MenuItemLink to='/counter' >
                                <Typography fontWeight='bold' style={{ color: '#fff' }}>Counter</Typography>
                            </MenuItemLink>
                        </Box>
                        <MenuItem component={NavLink} to="/" sx={{ display: 'flex', gap: 2 }}>
                            User Menu
                        </MenuItem>

                    </Toolbar>
                </Container>
                <Observer>{() => 
                    UIStore.isLoading ? (
                        <LinearProgress sx={{ 
                            position: 'absolute', 
                            width: '100%', 
                            bottom:0, 
                            left:0, 
                            right:0, 
                            height:4 }} color="secondary" />
                    ) : null
                }</Observer>
            </AppBar>
        </Box>
    )
}