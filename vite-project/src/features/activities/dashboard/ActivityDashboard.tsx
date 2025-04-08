import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";

export default function ActivityDashboard() {
    return (
        <Grid container spacing={2} sx={{ marginTop: '2rem' }}>
            <Grid size={7}>
                <ActivityList/>
            </Grid>
            <Grid size={5}>
                Activities Filters Go here
            </Grid>
        </Grid>
    )
}