import { FilterList, Event } from "@mui/icons-material";
import { Box, ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; // Import the CSS for the calendar

export default function ActivityFilters() {
  return (
    <Box sx={{ display: "flex",flexDirection: "column", gap: 3, borderRadius:3 }}>
        <Paper sx={{ padding: 3, borderRadius:3, backgroundColor: "#f5f5f5" }}>
        <Box sx={{width:'100%',}}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb:1, alignItems: "center", display: "flex", gap: 1, color: "primary.main" }}>
                <FilterList sx={{ color: "#333", mr:1 }} />
                 Filters
            </Typography>
            <MenuList>
                <MenuItem>
                    <ListItemText primary='All Events'/>
                </MenuItem>
                <MenuItem>
                    <ListItemText primary="I'm Going"/>
                </MenuItem>
                <MenuItem>
                    <ListItemText primary="I'm Hosting"/>
                </MenuItem>
            </MenuList>
        </Box>
        </Paper>
        <Box component={Paper} sx={{ padding: 3, borderRadius:3, width: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb:1, alignItems: "center", display: "flex", gap: 1 ,color: "primary.main" }}>
                <Event sx={{ color: "#333", mr:1 }} />
                Select Date
            </Typography>
            <Calendar/>
        </Box>
    </Box>
  )
}