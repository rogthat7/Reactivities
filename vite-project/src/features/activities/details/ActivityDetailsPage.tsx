
import { Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useActivities } from "../../../app/lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

export default function ActivityDetailsPage() {
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const {activity, isLoadingActivity } = useActivities(id);
    if(isLoadingActivity) return <Typography variant="h5" color="primary">Loading...</Typography>;
    if(!activity) return <Typography variant="h5" color="error">Activity not found</Typography>;
    return (
        <Grid container spacing={3}>
            <Grid size={8}>
                <ActivityDetailsHeader activity={activity}/>
                <ActivityDetailsInfo activity={activity}/>
                <ActivityDetailsChat/>
            </Grid>
            <Grid size={4}>
                <ActivityDetailsSidebar/>
            </Grid>

        </Grid>
    )
}