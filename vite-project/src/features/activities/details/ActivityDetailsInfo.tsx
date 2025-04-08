
import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Divider, Grid, Paper, Typography } from "@mui/material";
import { Activity } from "../../../app/models/activity";
import { formatDate } from "../../../app/lib/util/util";

type Props = {
    activity?: Activity; // Replace with the actual type of your activity object
}

export default function ActivityDetailsInfo({ activity }: Props) {
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
                    <Typography>{activity?.date ? formatDate(activity.date) : 'Date not available'}</Typography>
                </Grid>
            </Grid>
            <Divider />

            <Grid container alignItems="center" pl={2} py={1}>
                <Grid size={1}>
                    <Place color="info" fontSize="large" />
                </Grid>
                <Grid size={11}>
                    <Typography>
                        {activity?.venue}, {activity?.city}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

