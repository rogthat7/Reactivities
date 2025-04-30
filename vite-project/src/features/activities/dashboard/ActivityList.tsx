import { Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";


export default function ActivityList() {
    const {activities, isLoading } = useActivities();
    if (!activities) {
        return <Typography>No activities found.</Typography>
    }
    if(isLoading) return <Typography>Loading...</Typography>
    return (
        <div>
                {activities?.map(activity => (
                    <ActivityCard 
                    key={activity.id} 
                    activity={{ ...activity, hostImageUrl: activity.hostImageUrl ?? '' }}/>
                ))}
        </div>
    )
}