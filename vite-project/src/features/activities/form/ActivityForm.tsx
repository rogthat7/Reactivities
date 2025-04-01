import {  useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layouts/LoadingComponent";
import { FieldValues, useForm } from "react-hook-form";
import {Box, Button, Paper,  Typography} from '@mui/material';
import { ActivitySchema, activitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";
import { v4 as uuidv4 } from 'uuid';

export default observer (function ActivityForm() {
    const {register, reset,control, handleSubmit} = useForm<ActivitySchema>({
        mode : "onTouched",
        resolver: zodResolver(activitySchema)
    });
    const {activityStore} = useStore();
    const navigate = useNavigate();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial,selectedActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    if (id) {
       loadActivity(id).then(() => {
            console.log('Activity loaded:', selectedActivity);
        });
    }
    const [activity, setActivity] = useState<ActivitySchema>({
        title: selectedActivity?.title || '',
        description: selectedActivity?.description || '',
        category: selectedActivity?.category || '',
        date: selectedActivity?.date || new Date(),
        location: {
            city: selectedActivity?.city || '',
            venue: selectedActivity?.venue || '',
            latitude: selectedActivity?.latitude || 0,
            longitude: selectedActivity?.longitude || 0
        }
    });
    useEffect(() => {
        if (id) {
            reset({
                ...selectedActivity,
                location:{
                    city: selectedActivity?.city,
                    venue: selectedActivity?.venue,
                    latitude: selectedActivity?.latitude,
                    longitude: selectedActivity?.longitude
                }
            });
        }
    }, [id, activity]);
    if(loadingInitial) return <LoadingComponent content='Loading activity...'/>

    const onSubmit = async (data: ActivitySchema) => {
        const {location, ...activity} = data;
        const flattenedActivity = {...activity, ...location, city: location.city || ''};
        try {
            if (activity) {
                if (id) {
                    await updateActivity(id, flattenedActivity).then(() => {
                        navigate(`/activities/${id}`);
                    }).catch((error) => {
                        console.error("Error updating activity:", error);
                    });

                } else {
                    var newId = uuidv4();
                    var newActivity = {newId, ...flattenedActivity}
                    await createActivity(newActivity).then(() => {
                        navigate(`/activities/${newId}`);
                    }).catch((error) => {
                        console.error("Error creating activity:", error);
                    });
                }
            }
        } catch (error) {
            console.log(error)
            
        }
    }
    const handleInputChange = (data: FieldValues)=> {
        console.log('handleInputChange:' + data.target.name);
        setActivity({...activity, [data.target.name]: data.target.value});
    }
    return (
        <Paper sx={{padding: 3, borderRadius: 3}}>
            <Typography variant='h5' gutterBottom color="primary" align='center' >
            {selectedActivity?.id?
                `Edit Activity ${selectedActivity?.title ?? ''}`:
                'Create Activity'
            }</Typography>
            <hr/>
            <Box component={'form'} onSubmit={handleSubmit(onSubmit)} autoComplete='off' flexDirection={'column'} display='flex' gap={3}>
                <TextInput label='Title' value={selectedActivity?.title} control={control} name="title" />
                <TextInput label='Description' multiline rows={3} value={selectedActivity?.description} control={control} name="description" />
                <Box display='flex' gap={3}>
                
                <SelectInput 
                readOnly = {false}
                    items={categoryOptions} 
                    label='Category' 
                    control={control} 
                    name="category"
                    value={selectedActivity?.category}/>
                <DateTimeInput value={selectedActivity?.date} label='Date' control={control} name="date" />
                    
                </Box>
                
                <LocationInput control={control} name="location" label="Enter the Location"/>
                <Box display='flex' justifyContent='end' gap={3}>
                    <Button 
                        color="success" 
                        variant="contained" 
                        type='submit'
                        disabled={loading}
                    >Submit</Button>
                    <Button 
                        color="error" 
                        variant="outlined" 
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >Cancel</Button>
                </Box>
            </Box>
        </Paper>
    )
})
