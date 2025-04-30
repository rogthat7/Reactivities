
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { Grid, Typography } from "@mui/material";
import { useProfile } from "../../lib/hooks/useProfile";
import { useParams } from "react-router";

export default function ProfilePage() {
  const {id} = useParams(); // Replace with actual logic to get the profile ID
  const { profile, isLoadingProfile } = useProfile(id);
  if (isLoadingProfile) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>Profile not found</Typography>;
  return (
    <Grid>
        <Grid direction={'column'} container sx={{ marginTop: 2 }}>
           <ProfileHeader profile={profile}/>
           <ProfileContent/>
        </Grid>
    </Grid>
  )
}