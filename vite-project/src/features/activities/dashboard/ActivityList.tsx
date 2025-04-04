import { Activity } from "../../../app/models/activity";
import ActivityCard from "./ActivityCard";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity:(id:string)=> void;
}
export default function ActivityList({ activities, selectActivity, deleteActivity }: Props) {
    return (
        <div>
                {activities.map(activity => (
                    <ActivityCard 
                    key={activity.id} 
                    activity={activity} 
                    selectActivity={selectActivity} 
                    deleteActivity={deleteActivity} />
                ))}
        </div>
    )
}