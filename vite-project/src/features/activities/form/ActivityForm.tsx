import { ChangeEvent, FormEvent, useState } from "react";
import { Activity } from "../../../app/models/activity";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

interface Props  {
    closeForm: () => void;
    activity : Activity | undefined;
    submitForm: (activity: Activity) => void;
} 
export default function ActivityForm({activity:selectedActivty, closeForm, submitForm}: Props) {
    const initialState = selectedActivty ?? {
        id:'',
        title:'',
        category:'',
        description:'',
        date: '',
        city:'',
        venue: ''
    }
    const  [activity, setActivity] = useState(initialState);
    function handleSubmit( event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data:{[key:string]:FormDataEntryValue} ={};
        formData.forEach((value, key) => {
            data[key] = value;
        })
        
        if(activity) {
            activity.id = activity.id;
        }

        submitForm(data as unknown as Activity);
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
                <TextField type="date" label="Date" name="date" value={activity.date} onChange={handleInputChange} fullWidth margin="normal" required/>
                <TextField label="City" name="city" value={activity.city} onChange={handleInputChange} fullWidth margin="normal" required/>
                <TextField label="Venue" name="venue" value={activity.venue} onChange={handleInputChange} fullWidth margin="normal" required/>
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <Button variant="outlined" color="inherit" onClick={closeForm}>Cancel</Button>
                    <Button variant="contained" color="success" type="submit">Submit</Button>
                </Box>
            </Box>
        </Paper>
    )
}