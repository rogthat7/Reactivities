import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { Profile } from "../../app/models/Types/profile";
type ProfileHeaderProps = {
  profile: Profile
}

export default function ProfileHeader( { profile }: ProfileHeaderProps) {
  const isFollowing = true; // Replace with actual logic to determine if the user is following
  return (
    <Paper elevation={4} sx={{ padding: 2,  borderRadius: 3 }}>
      <Grid container alignItems="center">
        <Grid size={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              sx={{ width: 150, height: 150 }} 
              src={profile.imageUrl || '/assets/user.png'} 
              alt={profile.displayName+' image'} />
            <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography variant="h4" fontWeight={700}>{profile.displayName}</Typography>
              {isFollowing && <Chip variant="outlined" 
                                    label="Following" 
                                    color="secondary" 
                                    sx={{borderRadius: 1}}/>}
            </Box>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2} alignItems="center" >
            <Box display={'flex'} flexDirection={'row'} gap={2} width={'100%'} justifyContent={'space-around'}>
              <Box textAlign={'center'}>
                <Typography variant="h6" fontWeight={700}>Followers</Typography>
                <Typography variant="h3" fontWeight={700}>5</Typography>
              </Box>
              <Box textAlign={'center'}>
                <Typography variant="h6" fontWeight={700}>Following</Typography>
                <Typography variant="h3" fontWeight={700}>42</Typography>
              </Box>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Button
              variant="outlined"
              color={isFollowing ? "error" : "primary"}
              fullWidth
              >
              {isFollowing ? "Unfollow" : "Follow"}
              </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}