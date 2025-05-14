import {  useEffect } from "react";
import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";
import { activitySchema, ActivitySchema } from "../../../lib/schemas/activitySchema";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityForm() {

    const {id} = useParams<{id: string}>();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
    const navigate = useNavigate();
    if (isLoadingActivity) {
        <Typography>Loading Activity</Typography>
    }
    const {reset, handleSubmit,control} = useForm<ActivitySchema>({
        resolver : zodResolver(activitySchema),
        mode : "onTouched"
    })

    useEffect(() => {
            if (activity) {
                reset({ 
                    ...activity, 
                    date: activity.date || undefined, // Ensure date is not null
                    location: {
                        city: activity.city,
                        venue: activity.venue,
                        latitude: activity.latitude,
                        longitude: activity.longitude
                    } 
                });
            }
        }, [activity, reset])

    const onSubmit = (data : ActivitySchema) => {
        const {location, ...rest} = data;
        const flatteneData = {...rest, ...location}
        try{
            if (activity) {
                updateActivity.mutate({...activity, ...flatteneData}, {
                    onSuccess : ()=>navigate(`/activities/${activity.id}`)
                })
            }
            else{
                createActivity.mutate({ ...flatteneData, location: { ...location, city: location.city || '' } }, {
                    onSuccess: (activity ) => {
                        navigate(`/activities/${activity}`)// as our endpoint get activity returns id as data
                    }
                })
            }
        }
        catch(error){
            console.log(error);
            
        }
    };
    // if(activity || isLoadingActivity) return <Typography> Loading Activity...</Typography>
    return (
        <Paper elevation={3} sx={{ borderRadius: 3, padding: 2, margin: 1 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity?.id ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Box component="form" display="flex" gap={2} flexDirection='column' autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <TextInput 
                    label="Title"
                    control={control}
                    name="title"
                    />
                <TextInput label="Description" name='description' control={control} multiline rows={3} />
                <Box display={"flex"} gap={3}>
                <SelectInput items={categoryOptions} label="Category" name='category' control={control}/>
                <DateTimeInput label="Date" control={control} name="date"/>
                </Box>
                <LocationInput control={control} label='Enter the location' name='location' />
                <Box sx={{ display: 'flex', justifyContent: 'right', pb: 2 }}  justifyContent="space-between" marginTop={2}>
                    <ButtonGroup sx={{display:'flex', gap:2, borderRadius: 3}}>
                        <Button onClick={() => navigate(-1)}  variant="contained" color="inherit" >Cancel</Button>
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

