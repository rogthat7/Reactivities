import { FilterList, Event } from "@mui/icons-material";
import { Box, ListItemText, MenuItem, MenuList, Paper, Typography } from "@mui/material";
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; // Import the CSS for the calendar
import { useStore } from "../../../lib/hooks/useStore";
import { observer } from "mobx-react-lite";

const ActivityFilters =  observer(function ActivityFilters() {
    const {activityStore : {setFilter, setStartDate, filter, startDate}} = useStore();
  return (
    <Box sx={{ position: "sticky", top: '7rem', alignSelf: "flex-start", display : 'flex', flexDirection: "column", gap: 3, borderRadius:3 }}>
        <Paper sx={{ padding: 3, borderRadius:3, backgroundColor: "#f5f5f5" }}>
        <Box sx={{width:'100%',}}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb:1, alignItems: "center", display: "flex", gap: 1, color: "primary.main" }}>
                <FilterList sx={{ color: "#333", mr:1 }} />
                 Filters
            </Typography>
            <MenuList>
                <MenuItem
                    selected={filter === 'all'}
                    onClick={() => setFilter('all')}
                >
                    <ListItemText primary='All Events'/>
                </MenuItem>
                <MenuItem
                    selected={filter === 'isGoing'}
                    onClick={() => setFilter('isGoing')}
                >
                    <ListItemText primary="I'm Going"/>
                </MenuItem>
                <MenuItem
                    selected={filter === 'isHost'}
                    onClick={() => setFilter('isHost')}    
                >
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
            <Calendar
                value={startDate || new Date()}
                onChange={date => setStartDate(date as Date)}
            />
        </Box>
    </Box>
  )
})

export default ActivityFilters