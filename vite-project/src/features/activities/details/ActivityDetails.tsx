
import {  Card, Image } from "semantic-ui-react";
import { Button, ButtonGroup, CardActions, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../app/lib/hooks/useActivities";

export default function ActivityDetails() {
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const {activity: fetchedActivity, isLoadingActivity } = useActivities(id);
    if(isLoadingActivity) return <Typography variant="h5" color="primary">Loading...</Typography>;
    if(!fetchedActivity) return <Typography variant="h5" color="error">Activity not found</Typography>;
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${fetchedActivity?.category}.jpg`} />
            <Card.Content>
                <Card.Header>{fetchedActivity?.title}</Card.Header>
                <Card.Meta>
                    <span>{fetchedActivity?.date}</span>
                </Card.Meta>
                <Card.Description>
                    {fetchedActivity?.description}
                </Card.Description>
            </Card.Content>
            <CardActions>
                <ButtonGroup>
                    <Button variant="contained" component={Link} to={`/manage/${fetchedActivity.id}`} color='primary'>
                    <Typography >Edit</Typography>
                    </Button>
                    <Button variant="text" onClick={()=>navigate(`/activities`)} color="inherit">Cancel</Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )
}