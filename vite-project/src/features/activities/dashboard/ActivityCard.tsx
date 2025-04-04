
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material"
import { Activity } from "../../../app/models/activity"

type Props = {
    activity: Activity,
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityCard ({activity, selectActivity, deleteActivity} : Props) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3 , marginBottom: 2}}>
        <CardContent>
            <Typography variant="h5">{activity.title}</Typography>
            <Typography sx={{color: 'text.secondary', mb:1}}>{activity.date}</Typography>
            <Typography variant="body2">{activity.description}</Typography>
            <Typography variant="subtitle1">{activity.city}, {activity.venue}</Typography>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>
            <Chip label={activity.category} variant="outlined" color="primary" size="small" sx={{ fontSize: '0.8rem' }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={()=>selectActivity(activity.id)} variant="contained" color="primary" size="medium" sx={{ textTransform: 'none' }}>View</Button>
            <Button onClick={()=>deleteActivity(activity.id)} variant="outlined" color="error" size="medium" sx={{ textTransform: 'none' }}>Delete</Button>
            </Box>
        </CardActions>
      </Card>
    )
}
