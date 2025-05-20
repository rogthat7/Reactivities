import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashboard() {
  return (
    <Grid container spacing={2} sx={{ marginTop: "2rem" }}>
      <Grid size={8}>
        <ActivityList />
      </Grid>
      <Grid
        size={4}
        
      >
        <ActivityFilters />
      </Grid>
    </Grid>
  );
}
