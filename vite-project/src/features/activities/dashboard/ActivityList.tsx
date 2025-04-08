import { Typography } from "@mui/material";
import { useActivities } from "../../../app/lib/hooks/useActivities";
import ActivityCard from "./ActivityCard";


export default function ActivityList() {
    const {activities, isLoading } = useActivities();
    if(!activities || isLoading) return <Typography>Loading...</Typography>
    return (
        <div>
                {activities?.map(activity => (
                    <ActivityCard 
                    key={activity.id} 
                    activity={activity}/>
                ))}
        </div>
    )
}