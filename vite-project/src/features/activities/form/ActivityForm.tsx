import { ChangeEvent, FormEvent, useState } from "react";
import { Activity } from "../../../app/models/activity";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../app/lib/hooks/useActivities";
import { v4 as uuidv4 } from 'uuid';

interface Props  {
    closeForm: () => void;
    activity : Activity | undefined;
} 
export default function ActivityForm({activity:selectedActivty, closeForm}: Props) {
    const {updateActivity,createActivity, isLoading} = useActivities();
    const initialState = selectedActivty ?? {
        id:'',
        title:'',
        category:'',
        description:'',
        date: '',
        city:'',
        venue: '',
        latitude: 0,
        longitude: 0
    }
    const  [activity, setActivity] = useState(initialState);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data:{[key:string]:FormDataEntryValue} ={};
        formData.forEach((value, key) => {
            data[key] = value;
        })
        
        if(activity.id !== '') {
            activity.id = activity.id;
           await updateActivity.mutateAsync(activity);
        }
        else {
            activity.id = uuidv4()
            await createActivity.mutateAsync(activity);
        }
        closeForm();
        
    }
    function handleInputChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity,[name]:value})
    }
    return (
        <Paper elevation={3} sx={{ borderRadius:3, padding: 2, margin: 2 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity.id ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Box component="form" display="flex" flexDirection='column' autoComplete="off" onSubmit={handleSubmit}>
                <TextField label="Title" name="title" value={activity.title} onChange={handleInputChange} fullWidth margin="normal" required/>
                <TextField label="Category" name="category" value={activity.category} onChange={handleInputChange} fullWidth margin="normal" required/>
                <TextField label="Description" name="description" value={activity.description} onChange={handleInputChange} fullWidth margin="normal" required multiline rows={3}/>
                <TextField type="date" label="Date" name="date" onChange={handleInputChange} fullWidth margin="normal" required
                    defaultValue={activity?.date
                        ? new Date(activity.date).toISOString().split('T')[0] 
                        : new Date().toISOString().split('T')[0]
                    }
                />
                <TextField label="City" name="city" value={activity.city} onChange={handleInputChange} fullWidth margin="normal" required/>
                <TextField label="Venue" name="venue" value={activity.venue} onChange={handleInputChange} fullWidth margin="normal" required/>
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <Button variant="outlined" color="inherit" onClick={closeForm}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="success" 
                        type="submit"
                        disabled={updateActivity.isLoading || createActivity.isLoading}
                        >Submit
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}