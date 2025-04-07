
import {  Card, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useActivities } from "../../../app/lib/hooks/useActivities";

interface Props {
    selectedActivity : Activity;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}
export default function ActivityDetails({selectedActivity,cancelSelectActivity, openForm} : Props) {
    const {activities} = useActivities();
    const activity = (activities ?? []).find(a => a.id === selectedActivity.id);
    if(!activity) return <Typography variant="h5" color="error">Activity not found</Typography>;
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity?.title}</Card.Header>
                <Card.Meta>
                    <span>{activity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity?.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup>
                    <Button onClick={() => activity && openForm(activity.id)} color="primary">Edit</Button>
                    <Button onClick={cancelSelectActivity} color="inherit">Cancel</Button>
                </ButtonGroup>
            </Card.Content>
        </Card>
    )
}