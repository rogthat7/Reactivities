import {  useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layouts/LoadingComponent";
import { FieldValues, useForm } from "react-hook-form";
import {Box, Button, Paper, TextField, Typography} from '@mui/material';
import { ActivitySchema, activitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";

export default observer (function ActivityForm() {
    const {register, reset,control, handleSubmit} = useForm<ActivitySchema>({
        mode : "onTouched",
        resolver: zodResolver( activitySchema)
    });
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams<{id: string}>();
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    })
    
    useEffect(() => {
        if(id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);
    if(loadingInitial) return <LoadingComponent content='Loading activity...'/>

    const onSubmit = (data: ActivitySchema) => {
        console.log(data);
        // if(!activity.id) {
        //     activity.id = uuidv4();
        //     createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        // } else {
        //     updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        // }
    }
    const handleInputChange = (data: FieldValues)=> {
        console.log('handleInputChange:' + data.target.name);
        setActivity({...activity, [data.target.name]: data.target.value});
    }
    return (
        <Paper sx={{padding: 3, borderRadius: 3}}>
            <Typography variant='h5' gutterBottom color="primary" align='center' >
            {activity.id?
                `Edit Activity ${activity.title}`:
                'Create Activity'
            }</Typography>
            <hr/>
            <Box component={'form'} onSubmit={handleSubmit(onSubmit)} autoComplete='off' flexDirection={'column'} display='flex' gap={3}>
                <TextInput label='Title' value={activity.title} control={control} name="title"/>
                <TextInput label='Description' multiline rows={3} value={activity.description} control={control} name="description" />
                <SelectInput 
                items={categoryOptions} 
                label='Category' 
                control={control} 
                name="category"/>
                <TextInput type="date" label='Date' control={control} name="date" 
                    defaultValue={activity?.date  
                        ? new Date(activity.date).toISOString().split('T')[0] 
                        : new Date().toISOString().split('T')[0]} 
                />
                <TextInput label='City' value={activity.city} control={control} name="city" />
                <TextInput label='Venue' value={activity.venue} control={control} name="venue" />
                <Box display='flex' justifyContent='space-between' gap={3}>
                    <Button 
                        color="success" 
                        variant="contained" 
                        type='submit'
                        disabled={loading}
                    >Submit</Button>
                    <Button color="secondary"> Cancel </Button>
                </Box>
            </Box>
        </Paper>
    )
})
