import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { Activity } from "../../../app/models/activity";
import { useState } from "react";
import MapComponent from "../../../app/shared/components/MapComponent";
import { formatDate } from "../../../lib/util/util";

type Props = {
  activity?: Activity; // Replace with the actual type of your activity object
};

export default function ActivityDetailsInfo({ activity }: Props) {
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <Paper sx={{ mb: 2 }}>
      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <Info color="info" fontSize="large" />
        </Grid>
        <Grid size={11}>
          <Typography>{activity?.description}</Typography>
        </Grid>
      </Grid>
      <Divider />
      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <CalendarToday color="info" fontSize="large" />
        </Grid>
        <Grid size={11}>
          <Typography>
            {activity?.date ? formatDate(activity.date) : "Date not available"}
          </Typography>
        </Grid>
      </Grid>
      <Divider />

      <Grid container alignItems="center" pl={2} py={1}>
        <Grid size={1}>
          <Place color="info" fontSize="large" />
        </Grid>
        <Grid size={11} display={"flex"} justifyContent={"space-between"}  alignItems={"center"}>
          <Typography>
            {activity?.venue}, {activity?.city}
          </Typography>
            <Button
              onClick={() => {setMapOpen(!mapOpen)}}
            >
              {mapOpen ? "Hide map" : "Show map"}
            </Button>
        </Grid>
      </Grid>
      {mapOpen && (
                <Box sx={{height: 300, zIndex:1000, display:'block'}}>
                   <MapComponent position={[activity?.latitude ?? 0, activity?.longitude ?? 0]} venue={activity?.venue || "Unknown venue"}/>
                </Box>
            )}
    </Paper>
  );
}
