
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material"
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Activity } from "../../../app/models/activity"
import { Link } from "react-router";
import { Place } from "@mui/icons-material";
import { format } from "date-fns";
import { formatDate } from "../../../app/lib/util/util";

type Props = {
  activity: Activity,
}

export default function ActivityCard({ activity }: Props) {
  const isHost = false; // Placeholder for host check logic
  const isGoing = false; // Placeholder for going check logic
  const label = isGoing ? 'You are going' : isHost ? 'You are hosting' : 'You are not going';
  const isCancelled = false; // Placeholder for cancelled check logic
  const color = isCancelled ? 'error' : isGoing ? 'success' : isHost ? 'warning' : 'default';

  return (
    <Card elevation={2} sx={{ borderRadius: 3, boxShadow: 3, marginBottom: 2, }}>
      <Box display={'flex'} justifyContent='space-between' alignItems='center' sx={{ padding: 1 }}>
        <CardHeader
          avatar={<Avatar sx={{ height: 80, width: 80 }} src={'/assets/user.png'} />}
          title={activity.title}
          subheader={
            <>
              Hosted By{' '} <Link to={`/profile/bob`} style={{ textDecoration: 'none', color: 'text.primary' }}>Bob</Link>
            </>
          }
        />
        <Box display="flex" flexDirection="column" sx={{ mr: 2, gap: 2, backgroundColor: color, borderRadius: 1, padding: 0.5, color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {(isGoing || isHost) && <Chip label={label} color={color} size="small" sx={{ fontSize: '0.8rem', borderRadius: 2 }} />}
          {isCancelled && <Chip label="Cancelled" color="error" size="small" sx={{ fontSize: '0.8rem', borderRadius: 2 }} />}
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <CardContent sx={{ padding: 0 }}>
        <Box display='flex' alignItems='center' sx={{ mb: 2, px: 2 }}>
          <Box display='flex' alignItems='center' gap={0}>
            <AccessTimeIcon sx={{ color: 'text.primary', mr: 1, display: 'flex' }} />
            <Typography variant="body2" color="text.primary" noWrap>
              {formatDate(activity.date)}
            </Typography>
          </Box>
          <Place sx={{ ml: 3, mr: 1 }} />
          <Typography variant="body2"> {activity.venue}</Typography>
        </Box>
        <Divider />
        <Box display='flex' gap={2} sx={{ backgroundColor: 'grey.200', py: 3, pl: 3 }}>
          Attendees go here
        </Box>
        <CardActions sx={{ display: 'flex', ml: 1 }}>
          <Typography variant="body2" color="text.secondary">{activity.description}</Typography>
        </CardActions>
        <Box display='flex' justifyContent='flex-end' sx={{ padding: 1 }}>
          <Button
            component={Link}
            to={`/activities/${activity.id}`}
            variant="contained"
            color="primary" size="medium" sx={{ textTransform: 'none', justifySelf: 'self-end', borderRadius: 3 }}
          >View</Button>
          {/* <Button variant="outlined"
            color="error"
            size="medium"
            sx={{ textTransform: 'none' }}>Delete</Button> */}
        </Box>
      </CardContent>
    </Card>
  )
}
