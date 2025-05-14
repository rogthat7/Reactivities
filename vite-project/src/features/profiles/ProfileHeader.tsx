import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
export default function ProfileHeader() {
  const {id} = useParams(); // Replace with actual logic to get the profile ID
  const { profile, isCurrentUser, updateFollowing } = useProfile(id);
  if (!profile) return <Typography>Profile not found</Typography>;
  return (
    <Paper elevation={4} sx={{ padding: 2, borderRadius: 3 }}>
      <Grid container alignItems="center">
        <Grid size={8}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ width: 150, height: 150 }}
              src={profile.imageUrl || "/assets/user.png"}
              alt={profile.displayName + " image"}
            />
            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <Typography variant="h4" fontWeight={700}>
                {profile.displayName}
              </Typography>
              {profile.isFollowing && (
                <Chip
                  variant="outlined"
                  label="Following"
                  color="secondary"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2} alignItems="center">
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={2}
              width={"100%"}
              justifyContent={"space-around"}
            >
              <Box textAlign={"center"}>
                <Typography variant="h6" fontWeight={700}>
                  Followers
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {profile.followersCount}
                </Typography>
              </Box>
              <Box textAlign={"center"}>
                <Typography variant="h6" fontWeight={700}>
                  Following
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {profile.followingsCount}
                </Typography>
              </Box>
            </Box>
            {!isCurrentUser && (
              <>
                <Divider sx={{ width: "100%" }} />
                <Button
                onClick={() => updateFollowing.mutate()}
                  variant="outlined"
                  color={profile.isFollowing ? "error" : "primary"}
                  fullWidth
                >
                  {profile.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}