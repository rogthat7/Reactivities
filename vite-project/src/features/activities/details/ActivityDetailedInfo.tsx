import { observer } from 'mobx-react-lite';
import {Segment, Grid, Icon, Button, GridRow} from 'semantic-ui-react'
import {Activity} from "../../../app/models/activity";
import { useState } from 'react';
import { map } from 'leaflet';
import MapComponent from '../../../app/shared/components/MapComponent';
import { Box } from '@mui/material';

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedInfo({activity}: Props) {
    const [mapOpen, setMapOpen] = useState(false);
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info'/>
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{activity.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={15}>
            <span>
              {activity.date.toString()}
            </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal'/>
                    </Grid.Column>
                    <Grid.Column width={11} >
                        <span>{activity.venue}, {activity.city}</span>
                    </Grid.Column>
                    <Grid.Column width={4} textAlign='right'>
                    <Button icon="map" onClick={() => setMapOpen(!mapOpen)} color='teal' size='tiny' content={mapOpen ? 'Hide map' : 'Show map'}></Button>  
                    </Grid.Column>
                </Grid>
            </Segment>
            {mapOpen && (
                <Box sx={{height: 300, zIndex:"1000", display:'block'}}>
                    <MapComponent 
                    position={[activity.latitude,activity.longitude]} 
                    venue={activity.venue} />
                </Box>
            )}
        </Segment.Group>
   
)});