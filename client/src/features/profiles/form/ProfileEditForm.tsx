import { Box, Button, Paper, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../../lib/hooks/useProfile";
import { profileSchema, ProfileSchema } from "../../../lib/schemas/profileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import TextInput from "../../../app/shared/components/TextInput";

type Props = {
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm( { setEditMode }: Props) {
    const {id} = useParams<{ id: string }>();
    const {profile, editProfile} = useProfile(id);
     const {handleSubmit,reset,control} = useForm<ProfileSchema>({
            resolver : zodResolver(profileSchema),
            mode : "onTouched"
        })
    const [displayNameValue, setDisplayNameValue] = useState(profile?.displayName || '');
    const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {        
        setDisplayNameValue(event.target.value);
    };
    const [bioValue, setBioValue] = useState(profile?.bio || '');
    const handleBioValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBioValue(event.target.value);
    }

    useEffect(() => {
        if (profile) reset({ ...profile, bio: profile.bio ?? undefined })
        }, [profile, reset]);

    const onSubmit = (profileData : ProfileSchema) => {
            try{
                if (profileData) {
                    if (!profile?.id) {
                        console.error("Profile ID is missing");
                        return;
                    }
                    const updatedProfile = { ...profile, ...profileData, id: profile.id };
                    editProfile.mutate(updatedProfile, {
                        onSuccess : () => {
                            setEditMode(false); // Close the edit profile form after successful update
                        },
                        onError: (error) => {
                            console.log(error);
                        }

                    })
                }
                else{
                    console.log('Profile data is not available');
                }
            }
            catch(error){
                console.log(error);
                
            }
        };
  return (
    <Paper>
            <Box component="form" display="flex" marginTop={1} gap={2} flexDirection='column' autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <TextInput 
                    label="Display Name"
                    name='displayName'
                    value={displayNameValue}
                    onChange={handleDisplayNameChange}
                    fullWidth
                    variant="outlined"
                    control = {control}
                    />
                <TextInput
                    label="Bio"
                    value={bioValue}
                    onChange={handleBioValueChange}
                    name='bio'
                    multiline
                    rows={7}
                    control = {control}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'right', pb: 2 }}  justifyContent="space-between" marginTop={2}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        <Button 
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={editProfile.isPending || profile?.displayName === displayNameValue && profile?.bio === bioValue}
                        >
                            Update Profile
                        </Button>
                        </Typography>
                </Box>
            </Box>
        </Paper>
  )
}