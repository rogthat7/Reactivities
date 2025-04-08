import { FormEvent } from "react";
import { Box, Button, ButtonGroup, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../app/lib/hooks/useActivities";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router";
import { Activity } from "../../../app/models/activity";

export default function ActivityForm() {
    const {id} = useParams<{id: string}>();
    const { updateActivity, createActivity,isLoading, activity } = useActivities(id);
    const navigate = useNavigate();
    if(isLoading) return <Typography variant="h5" color="primary">Loading...</Typography>;
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data: { [key: string]: FormDataEntryValue } = {};
        formData.forEach((value, key) => {
            data[key] = value;
        })

        if (activity) {
            data.id = activity.id;
            await updateActivity.mutateAsync(data as unknown as Activity);
            navigate(`/activities/${activity.id}`);
        }
        else {
            data.id = uuidv4()
            createActivity.mutate(data as unknown as Activity, {
                onSuccess: () => {
                    navigate(`/activities/${data.id}`);
                }
            });
        }

    }

    return (
        <Paper elevation={3} sx={{ borderRadius: 3, padding: 2, margin: 1 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity?.id ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Box component="form" display="flex" flexDirection='column' autoComplete="off" onSubmit={handleSubmit}>
                <TextField label="Title" name="title" value={activity?.title} fullWidth margin="dense" required />
                <TextField label="Category" name="category" value={activity?.category} fullWidth margin="dense" required />
                <TextField label="Description" name="description" value={activity?.description} fullWidth margin="dense" required multiline rows={3} />
                <TextField type="date" label="Date" name="date" fullWidth margin="dense" required
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]
                    }
                />
                <TextField label="City" name="city" value={activity?.city} fullWidth margin="normal" required />
                <TextField label="Venue" name="venue" value={activity?.venue} fullWidth margin="normal" required />
                <Box sx={{ display: 'flex', justifyContent: 'right', pb: 2 }}  justifyContent="space-between" marginTop={2}>
                    <ButtonGroup sx={{display:'flex', gap:2, borderRadius: 3}}>
                        <Button  variant="contained" color="error" >Cancel</Button>
                        <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            disabled={updateActivity.isLoading || createActivity.isLoading}
                        >Submit
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Paper>
    )
}