import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button, Divider, Typography } from "@mui/material";

export default function ProfileAbout() {
    const {id} = useParams<{ id: string }>();
  const {profile} = useProfile(id);
  return (
    <Box>
        <Box sx={{display: 'flex' , justifyContent: 'space-between', alignItems: 'center'}}>
           <Typography variant="h5" fontWeight={600} mb={2}>
                About {profile?.displayName}
            </Typography>
            <Button>
                Edit Profile
            </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{overflow: 'auto', maxHeight: 350}}>
            <Typography variant="body1" fontWeight={600} mb={2} sx={{whiteSpace: 'pre-wrap'}}>
                Bio
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>
                {profile?.bio || 'No description added yet'}
            </Typography>
            <Typography variant="body1" fontWeight={600} mb={2}>
                Interests
            </Typography>
            </Box>
    </Box>
  )
}