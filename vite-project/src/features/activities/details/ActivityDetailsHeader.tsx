import { Card, CardMedia, Box, Typography, Chip } from "@mui/material";
import { Link } from "react-router";
import { Activity } from "../../../app/models/Types/activity";
import { formatDate } from "../../../lib/util/util";
import { useActivities } from "../../../lib/hooks/useActivities";
import ThemedButton from "../../../app/shared/components/ThemedButton";

type Props = {
    activity?: Activity; // Replace with the actual type of your activity object
}

export default function ActivityDetailsHeader( { activity }: Props) {
    const { updateAttendance}= useActivities(activity?.id);
    return (
        <Card sx={{ position: 'relative', mb: 2, backgroundColor: 'transparent', overflow: 'hidden' }}>
        {activity?.isCancelled && (
            <Chip
                sx={{ position: 'absolute', left: 40, top: 20, zIndex: 1000, borderRadius:1}}
                color="error"
                label="Cancelled"
            />
        )}
        <CardMedia
            component="img"
            height="300"
            image={`/assets/categoryImages/${activity?.category}.jpg`}
            alt={`${activity?.category} image`}
        />
        <Box sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            color: 'white',
            padding: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 1.0), transparent)',
            boxSizing: 'border-box',
        }}>
            {/* Text Section */}
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{activity?.title}</Typography>
                <Typography variant="subtitle1">{activity?.date ? formatDate(activity.date) : 'Date not available'}</Typography>
                <Typography variant="subtitle2">
                    Hosted by <Link to={`/profiles/${activity?.hostId}`} style={{ color: 'white', fontWeight: 'bold' }}>{activity?.hostDisplayName}</Link>
                </Typography>
            </Box>

            {/* Buttons aligned to the right */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                {activity?.isHost ? (
                    <>
                        <ThemedButton
                            variant='contained'
                            color={activity?.isCancelled ? 'success' : 'error'}
                            onClick={() => activity?.id && updateAttendance.mutate(activity.id)}
                            disabled={updateAttendance.isLoading}
                        >
                          <Typography>{activity?.isCancelled ? 'Re-activate Activity' : 'Cancel Activity'}</Typography>  
                        </ThemedButton>
                        <ThemedButton
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/manage/${activity?.id}`}
                            disabled={activity?.isCancelled}
                        >
                            <Typography color="White">Manage Event</Typography>
                        </ThemedButton>
                    </>
                ) : (
                    <ThemedButton
                        variant="contained"
                        color={activity?.isGoing ? 'primary' : 'info'}
                        onClick={() => activity?.id && updateAttendance.mutate(activity.id)}
                        disabled={updateAttendance.isLoading || activity?.isCancelled}
                    >
                        {activity?.isGoing ? 'Cancel Attendance' : 'Join Activity'}
                    </ThemedButton>
                )}
            </Box>
        </Box>
    </Card>
    )
}

